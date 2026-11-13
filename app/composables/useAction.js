import toast from "@app/constants/toast.json";
import { focusFirstInvalid } from "@app/utils/focus";
import { notifyError, notifySuccess } from "@app/utils/notify";

export const useAction = (handler, { success, silent = false, validate } = {}) => {
  const pending = ref(false);
  const error = ref(null);
  const fieldErrors = ref({});

  const run = async (...args) => {
    error.value = null;
    fieldErrors.value = {};

    const invalid = validate?.(...args) ?? {};
    if (Object.keys(invalid).length) {
      fieldErrors.value = invalid;
      focusFirstInvalid();
      notifyError({ statusCode: 422, message: toast.messages.checkFields });
      return undefined;
    }

    pending.value = true;

    try {
      const result = await handler(...args);
      if (success)
        notifySuccess(
          typeof success === "function" ? success(result) : success,
        );
      return result;
    } catch (failure) {
      error.value = failure;
      fieldErrors.value = failure.fieldErrors?.() ?? {};
      if (Object.keys(fieldErrors.value).length) focusFirstInvalid();
      if (!silent) notifyError(failure);
      return undefined;
    } finally {
      pending.value = false;
    }
  };

  return { run, pending, error, fieldErrors };
};
