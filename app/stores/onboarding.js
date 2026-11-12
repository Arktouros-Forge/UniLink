import { defineStore } from "pinia";

export const useOnboardingStore = defineStore("onboarding", () => {
  const form = reactive({ name: "", nim: "", cohort: "", skills: [], bio: "", phone: "", ready: false });

  const hydrate = (user) => {
    if (!user) return;
    if (form.ready) return;
    Object.assign(form, {
      name: user.name,
      nim: user.nim ?? "",
      cohort: user.cohort ? String(user.cohort) : "",
      skills: [...(user.skillIds ?? [])],
      bio: user.bio ?? "",
      phone: user.phone ?? "",
      ready: true,
    });
  };

  const reset = () => Object.assign(form, { ready: false });

  return { form, hydrate, reset };
});
