import { defineApi } from "@server/utils/api.js";
import { clearSessionCookie } from "@server/utils/session.js";

export default defineApi({ auth: false, message: "Logged out" }, ({ event }) => {
  clearSessionCookie(event);
  return null;
});
