import { defineApi } from "@server/utils/api.js";
import { updateProfile } from "@server/services/users/users.service.js";
import { profileBody } from "@server/validators/users.js";

export default defineApi(
  { auth: "any", body: profileBody, message: "Profile updated" },
  ({ user, body }) => updateProfile(user.id, body),
);
