import toast from "@app/constants/toast.json";
import { collect } from "@app/utils/fieldError";
import { focusFirstInvalid } from "@app/utils/focus";
import { notifyError } from "@app/utils/notify";

export const useLocalCheck = (serverErrors) => {
  const local = ref({});
  const errors = computed(() => ({ ...(serverErrors?.value ?? serverErrors ?? {}), ...local.value }));

  const check = (checks) => {
    local.value = collect(checks);
    if (!Object.keys(local.value).length) return true;
    focusFirstInvalid();
    notifyError({ statusCode: 422, message: toast.messages.checkFields });
    return false;
  };
  const reset = () => (local.value = {});

  return { errors, check, reset };
};
