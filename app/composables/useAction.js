import { notifyError, notifySuccess } from "@app/utils/notify";

export const useAction = (handler, { success, silent = false } = {}) => {
  const pending = ref(false);
  const error = ref(null);
  const fieldErrors = ref({});

  const run = async (...args) => {
    pending.value = true;
    error.value = null;
    fieldErrors.value = {};

    try {
      const result = await handler(...args);
      if (success) notifySuccess(typeof success === "function" ? success(result) : success);
      return result;
    } catch (failure) {
      error.value = failure;
      fieldErrors.value = failure.fieldErrors?.() ?? {};
      if (!silent) notifyError(failure);
      return undefined;
    } finally {
      pending.value = false;
    }
  };

  return { run, pending, error, fieldErrors };
};
