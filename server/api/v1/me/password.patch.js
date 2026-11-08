import { defineApi, ok } from "@server/utils/api.js";
import { issueSession } from "@server/utils/session.js";
import { changePassword } from "@server/services/users/users.service.js";
import { passwordBody } from "@server/validators/users.js";

export default defineApi({ auth: "any", body: passwordBody }, async ({ event, user, body }) => {
  const updated = await changePassword(user.id, body.currentPassword, body.newPassword);
  await issueSession(event, updated);
  return ok({ changed: true }, "Password updated");
});
