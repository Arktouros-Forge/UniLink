import { and, asc, eq, sql } from "drizzle-orm";

import { db } from "@database/index";
import { lecturers, timetableEvents } from "@database/schema/index";

import { fail } from "../../utils/errors.js";
import { buildIcs, parseIcs } from "./ics.js";

const columns = {
  id: timetableEvents.id,
  courseCode: timetableEvents.courseCode,
  title: timetableEvents.title,
  dayOfWeek: timetableEvents.dayOfWeek,
  startTime: sql`to_char(${timetableEvents.startTime}, 'HH24:MI')`,
  endTime: sql`to_char(${timetableEvents.endTime}, 'HH24:MI')`,
  room: timetableEvents.room,
  recurrence: timetableEvents.recurrence,
  source: timetableEvents.source,
  lecturerId: timetableEvents.lecturerId,
  lecturerName: sql`coalesce(${lecturers.name}, ${timetableEvents.lecturerNameFreeText})`,
  lecturer: sql`case when ${lecturers.id} is null then null else json_build_object('id', ${lecturers.id}, 'name', ${lecturers.name}, 'email', ${lecturers.email}, 'phone', ${lecturers.phone}, 'profilePhotoUrl', ${lecturers.profilePhotoUrl}) end`,
};

const base = (executor) =>
  executor
    .select(columns)
    .from(timetableEvents)
    .leftJoin(lecturers, eq(lecturers.id, timetableEvents.lecturerId));

export async function listEvents(userId, { day } = {}) {
  const where = and(
    eq(timetableEvents.userId, userId),
    day ? eq(timetableEvents.dayOfWeek, day) : undefined,
  );
  const events = await base(db)
    .where(where)
    .orderBy(asc(timetableEvents.dayOfWeek), asc(timetableEvents.startTime));

  const byDay = Object.fromEntries(
    [1, 2, 3, 4, 5, 6, 7].map((n) => [
      n,
      events.filter((event) => event.dayOfWeek === n),
    ]),
  );
  const minutes = events.reduce((sum, event) => {
    const [sh, sm] = event.startTime.split(":").map(Number);
    const [eh, em] = event.endTime.split(":").map(Number);
    return sum + (eh * 60 + em - (sh * 60 + sm));
  }, 0);

  return {
    events,
    byDay,
    summary: {
      total: events.length,
      weeklyHours: Math.round((minutes / 60) * 10) / 10,
      activeDays: Object.values(byDay).filter((list) => list.length).length,
    },
  };
}

async function assertLecturer(executor, lecturerId) {
  if (!lecturerId) return;
  const [row] = await executor
    .select({ id: lecturers.id })
    .from(lecturers)
    .where(eq(lecturers.id, lecturerId))
    .limit(1);
  if (!row) fail("LECTURER_NOT_FOUND");
}

async function assertNoOverlap(executor, userId, event, ignoreId) {
  const [clash] = await executor
    .select({ id: timetableEvents.id, title: timetableEvents.title })
    .from(timetableEvents)
    .where(
      and(
        eq(timetableEvents.userId, userId),
        eq(timetableEvents.dayOfWeek, event.dayOfWeek),
        sql`${timetableEvents.startTime} < ${event.endTime}::time and ${timetableEvents.endTime} > ${event.startTime}::time`,
        ignoreId ? sql`${timetableEvents.id} <> ${ignoreId}` : undefined,
      ),
    )
    .limit(1);
  if (clash)
    fail("EVENT_OVERLAP", [
      { field: "startTime", message: `Overlaps with "${clash.title}"` },
    ]);
}

const getOne = async (userId, id) => {
  const [event] = await base(db)
    .where(and(eq(timetableEvents.id, id), eq(timetableEvents.userId, userId)))
    .limit(1);
  if (!event) fail("EVENT_NOT_FOUND");
  return event;
};

export async function createEvent(userId, data) {
  await assertLecturer(db, data.lecturerId);
  await assertNoOverlap(db, userId, data);
  const [row] = await db
    .insert(timetableEvents)
    .values({ ...data, userId })
    .returning({ id: timetableEvents.id });
  return getOne(userId, row.id);
}

export async function updateEvent(userId, id, data) {
  const current = await getOne(userId, id);
  const next = { ...current, ...data };
  await assertLecturer(db, data.lecturerId);
  await assertNoOverlap(db, userId, next, id);

  if (data.lecturerId) data.lecturerNameFreeText = null;
  if (data.lecturerNameFreeText) data.lecturerId = null;

  await db
    .update(timetableEvents)
    .set(data)
    .where(and(eq(timetableEvents.id, id), eq(timetableEvents.userId, userId)));
  return getOne(userId, id);
}

export async function deleteEvent(userId, id) {
  const removed = await db
    .delete(timetableEvents)
    .where(and(eq(timetableEvents.id, id), eq(timetableEvents.userId, userId)))
    .returning({ id: timetableEvents.id });
  if (!removed.length) fail("EVENT_NOT_FOUND");
  return { id };
}

export async function clearEvents(userId, source) {
  const removed = await db
    .delete(timetableEvents)
    .where(
      and(
        eq(timetableEvents.userId, userId),
        source ? eq(timetableEvents.source, source) : undefined,
      ),
    )
    .returning({ id: timetableEvents.id });
  return { removed: removed.length };
}

export async function importEvents(
  userId,
  { format, events, content, replace },
) {
  const parsed = format === "ics" ? parseIcs(content) : events;
  const source = format === "ics" ? "ics_import" : "json_import";

  const rows = parsed
    .filter(
      (event) =>
        event.endTime > event.startTime &&
        event.dayOfWeek >= 1 &&
        event.dayOfWeek <= 7,
    )
    .map((event) => ({
      userId,
      source,
      courseCode: event.courseCode ?? null,
      title: event.title,
      dayOfWeek: event.dayOfWeek,
      startTime: event.startTime,
      endTime: event.endTime,
      room: event.room ?? null,
      lecturerNameFreeText: event.lecturerName ?? null,
      recurrence: event.recurrence ?? "weekly",
    }));

  if (!rows.length) fail("IMPORT_EMPTY");

  const imported = await db.transaction(async (tx) => {
    if (replace)
      await tx
        .delete(timetableEvents)
        .where(eq(timetableEvents.userId, userId));
    const inserted = await tx
      .insert(timetableEvents)
      .values(rows)
      .returning({ id: timetableEvents.id });
    return inserted.length;
  });

  return { imported, skipped: parsed.length - rows.length };
}

export async function exportEvents(userId, format) {
  const { events } = await listEvents(userId);
  if (format === "ics")
    return {
      contentType: "text/calendar; charset=utf-8",
      filename: "unilink-jadwal.ics",
      body: buildIcs(events),
    };
  return {
    contentType: "application/json; charset=utf-8",
    filename: "unilink-jadwal.json",
    body: JSON.stringify({ version: 1, events }, null, 2),
  };
}
