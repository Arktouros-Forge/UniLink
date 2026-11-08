const DAY_CODES = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

const unfold = (text) => text.replace(/\r?\n[ \t]/g, "");

const readDate = (value) => {
  const m = value.match(/(\d{4})(\d{2})(\d{2})T?(\d{2})?(\d{2})?/);
  if (!m) return null;
  const date = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return {
    day: ((date.getUTCDay() + 6) % 7) + 1,
    time: `${m[4] ?? "00"}:${m[5] ?? "00"}:00`,
  };
};

export function parseIcs(text) {
  const events = [];
  for (const block of unfold(text).split("BEGIN:VEVENT").slice(1)) {
    const field = (name) =>
      block.match(new RegExp(`^${name}[^:\\r\\n]*:(.*)$`, "m"))?.[1]?.trim();
    const start = readDate(field("DTSTART") ?? "");
    const end = readDate(field("DTEND") ?? "");
    const title = field("SUMMARY");
    if (!start || !end || !title) continue;

    const byDay = field("RRULE")?.match(/BYDAY=([A-Z]{2})/)?.[1];
    const day = byDay ? DAY_CODES.indexOf(byDay) + 1 || start.day : start.day;

    events.push({
      title: title.replace(/\\,/g, ","),
      dayOfWeek: day,
      startTime: start.time,
      endTime: end.time,
      room: field("LOCATION")?.replace(/\\,/g, ","),
      recurrence: field("RRULE") ? "weekly" : "none",
    });
  }
  return events;
}

const stamp = (day, time) => {
  const base = new Date(Date.UTC(2026, 0, 4 + day));
  const y = base.getUTCFullYear();
  const m = String(base.getUTCMonth() + 1).padStart(2, "0");
  const d = String(base.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}T${time.slice(0, 2)}${time.slice(3, 5)}00`;
};

export function buildIcs(events) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//UniLink//Timetable//ID",
    "CALSCALE:GREGORIAN",
  ];

  for (const event of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.id}@unilink`,
      `DTSTAMP:${stamp(1, "00:00")}Z`,
      `DTSTART;TZID=Asia/Makassar:${stamp(event.dayOfWeek, event.startTime)}`,
      `DTEND;TZID=Asia/Makassar:${stamp(event.dayOfWeek, event.endTime)}`,
      `SUMMARY:${(event.courseCode ? `${event.courseCode} ` : "") + event.title}`,
    );
    if (event.room) lines.push(`LOCATION:${event.room}`);
    if (event.recurrence === "weekly")
      lines.push(`RRULE:FREQ=WEEKLY;BYDAY=${DAY_CODES[event.dayOfWeek - 1]}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
