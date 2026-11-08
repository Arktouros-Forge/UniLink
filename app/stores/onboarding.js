import { defineStore } from "pinia";

export const useOnboardingStore = defineStore("onboarding", () => {
  const form = reactive({ name: "", cohort: "", skills: [], bio: "", phone: "", ready: false });

  const hydrate = (user) => {
    if (form.ready) return;
    Object.assign(form, {
      name: user.name,
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
