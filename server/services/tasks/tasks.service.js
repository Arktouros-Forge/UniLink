import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";

import { db } from "@database/index";
import { tasks } from "@database/schema/index";

import { fail } from "../../utils/errors.js";
import { likePattern, pageMeta } from "../../utils/pagination.js";

const today = sql`current_date`;

const filters = {
  open: () => eq(tasks.completed, false),
  done: () => eq(tasks.completed, true),
  overdue: () =>
    and(eq(tasks.completed, false), sql`${tasks.dueDate} < ${today}`),
  today: () =>
    and(eq(tasks.completed, false), sql`${tasks.dueDate} = ${today}`),
  upcoming: () =>
    and(eq(tasks.completed, false), sql`${tasks.dueDate} > ${today}`),
};

export async function listTasks(
  userId,
  { status, priority, q, sort, page, limit },
) {
  const conditions = [eq(tasks.userId, userId)];
  if (status !== "all") conditions.push(filters[status]());
  if (priority) conditions.push(eq(tasks.priority, priority));
  if (q)
    conditions.push(
      or(
        ilike(tasks.title, likePattern(q)),
        ilike(tasks.course, likePattern(q)),
      ),
    );

  const where = and(...conditions);
  const order =
    sort === "created"
      ? [desc(tasks.createdAt)]
      : [
          asc(tasks.completed),
          sql`${tasks.dueDate} asc nulls last`,
          desc(tasks.priority),
        ];

  const [items, [summary]] = await Promise.all([
    db
      .select()
      .from(tasks)
      .where(where)
      .orderBy(...order)
      .limit(limit)
      .offset((page - 1) * limit),
    db.execute(sql`
      select
        count(*) filter (where not completed)::int as open,
        count(*) filter (where completed)::int as done,
        count(*) filter (where not completed and due_date < current_date)::int as overdue,
        count(*) filter (where not completed and due_date = current_date)::int as today,
        count(*) filter (where not completed and due_date > current_date)::int as upcoming,
        count(*)::int as total
      from tasks where user_id = ${userId}
    `),
  ]);

  const selected = status === "all" ? summary.total : summary[status];
  return {
    tasks: items,
    summary,
    pagination: pageMeta(page, limit, selected ?? 0),
  };
}

export async function createTask(userId, data) {
  const [task] = await db
    .insert(tasks)
    .values({ ...data, userId })
    .returning();
  return task;
}

export async function updateTask(userId, id, { completed, ...data }) {
  const patch = { ...data };
  if (completed !== undefined) {
    patch.completed = completed;
    patch.completedAt = completed ? new Date() : null;
  }

  const [task] = await db
    .update(tasks)
    .set(patch)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .returning();

  if (!task) fail("TASK_NOT_FOUND");
  return task;
}

export async function deleteTask(userId, id) {
  const removed = await db
    .delete(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .returning({ id: tasks.id });
  if (!removed.length) fail("TASK_NOT_FOUND");
  return { id };
}

export async function clearCompleted(userId) {
  const removed = await db
    .delete(tasks)
    .where(and(eq(tasks.userId, userId), eq(tasks.completed, true)))
    .returning({ id: tasks.id });
  return { removed: removed.length };
}
