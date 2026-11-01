import { defineStore } from "pinia";
import { ref } from "vue";
import eventsData from "@app/constants/mock/events.json";
import { createCrud } from "@app/utils/crud";
import { overlaps } from "@app/utils/timetable";

export const useTimetableStore = defineStore("timetable", () => {
  const events = ref([...eventsData]);
  const crud = createCrud(events, "e");

  const byDay = (day) => events.value.filter((event) => event.dayOfWeek === day).sort((a, b) => a.start.localeCompare(b.start));
  const conflictsWith = (candidate) => events.value.filter((event) => event.id !== candidate.id && overlaps(event, candidate));
  const clear = () => {
    events.value = [];
  };

  return { events, byDay, conflictsWith, clear, ...crud };
});
