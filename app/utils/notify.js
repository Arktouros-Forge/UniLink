import { toast } from "vue-sonner";

import copy from "@app/constants/toast.json";

const describe = (errors = []) =>
  errors
    .slice(0, 3)
    .map((item) =>
      item.field
        ? `${copy.fieldLabels[item.field] ?? item.field}: ${item.message}`
        : item.message,
    )
    .join("\n");

export const notifySuccess = (message) =>
  toast.success(message, { id: message });

export const notifyError = (failure) => {
  const status = failure?.statusCode ?? 0;
  let title = failure?.message || copy.fallback;
  let description = describe(failure?.errors);

  if (status === 0) {
    title = copy.network;
    description = copy.networkHint;
  } else if (status >= 500) {
    title = copy.server;
    description = copy.serverHint;
  } else if (status === 403 && !failure?.message) {
    title = copy.forbidden;
  }

  toast.error(title, {
    id: `${title}${description}`,
    description: description || undefined,
    duration: 7000,
  });
};
