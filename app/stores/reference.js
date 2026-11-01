import { defineStore } from "pinia";
import { computed, ref } from "vue";
import skillsData from "@app/constants/mock/skills.json";
import categoriesData from "@app/constants/mock/categories.json";
import lecturersData from "@app/constants/mock/lecturers.json";
import { createCrud, indexById } from "@app/utils/crud";

export const useReferenceStore = defineStore("reference", () => {
  const skills = ref([...skillsData]);
  const categories = ref([...categoriesData]);
  const lecturers = ref([...lecturersData]);

  const skillsById = computed(() => indexById(skills.value));
  const categoriesById = computed(() => indexById(categories.value));
  const lecturersById = computed(() => indexById(lecturers.value));

  const skillOptions = computed(() => skills.value.map((item) => ({ value: item.id, label: item.name })));
  const lecturerOptions = computed(() => lecturers.value.map((item) => ({ value: item.id, label: item.name })));

  return {
    skills,
    categories,
    lecturers,
    skillsById,
    categoriesById,
    lecturersById,
    skillOptions,
    lecturerOptions,
    skillCrud: createCrud(skills, "s"),
    categoryCrud: createCrud(categories, "c"),
    lecturerCrud: createCrud(lecturers, "l"),
  };
});
