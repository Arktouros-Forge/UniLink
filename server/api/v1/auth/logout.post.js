import { defineApi } from "@server/utils/api.js";
import { clearSession } from "@server/utils/session.js";

export default defineApi({ auth: false, message: "Logged out" }, ({ event }) => {
  clearSession(event);
  return null;
});
