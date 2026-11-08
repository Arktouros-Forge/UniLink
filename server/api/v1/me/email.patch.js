import { defineApi } from "@server/utils/api.js";
import { changeEmail } from "@server/services/users/users.service.js";
import { emailBody } from "@server/validators/users.js";

export default defineApi(
  { auth: "any", body: emailBody, message: "Email updated" },
  ({ user, body }) => changeEmail(user.id, body.currentPassword, body.email),
);
