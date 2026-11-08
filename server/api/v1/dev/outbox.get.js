import { defineApi } from "@server/utils/api.js";
import { fail } from "@server/utils/errors.js";
import { getOutbox } from "@server/utils/mailer.js";

export default defineApi({ auth: false }, () => {
  if (!import.meta.dev) fail("NOT_FOUND");
  return getOutbox();
});
