export const overlaps = (a, b) => a.dayOfWeek === b.dayOfWeek && a.start < b.end && b.start < a.end;

export const toExportJson = (user, events, lecturers) => ({
  version: "1.1",
  source: "unilink",
  student: { username: user.username, nim: user.nim, year: Number(user.year) },
  events: events.map((event) => {
    const lecturer = lecturers.find((item) => item.id === event.lecturerId);
    return {
      course_code: event.courseCode,
      title: event.title,
      day_of_week: event.dayOfWeek,
      start_time: event.start,
      end_time: event.end,
      room: event.room,
      recurrence: "weekly",
      ...(lecturer && { lecturer: { name: lecturer.name, email: lecturer.email, phone: lecturer.phone, nidn: lecturer.nidn } }),
    };
  }),
});

export const downloadJson = (data, filename) => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
