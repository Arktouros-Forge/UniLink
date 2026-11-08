import { useToastStore } from "@app/stores/toast";

export const useAction = (handler, { success, silent = false } = {}) => {
  const toast = useToastStore();
  const pending = ref(false);
  const error = ref(null);
  const fieldErrors = ref({});

  const run = async (...args) => {
    pending.value = true;
    error.value = null;
    fieldErrors.value = {};

    try {
      const result = await handler(...args);
      if (success) toast.push(typeof success === "function" ? success(result) : success, "success");
      return result;
    } catch (failure) {
      error.value = failure;
      fieldErrors.value = failure.fieldErrors?.() ?? {};
      if (!silent) toast.push(failure.message, "error");
      return undefined;
    } finally {
      pending.value = false;
    }
  };

  return { run, pending, error, fieldErrors };
};
