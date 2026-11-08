import { defineApi } from "@server/utils/api.js";
import { resetPassword } from "@server/services/auth/auth.service.js";
import { resetBody } from "@server/validators/auth.js";

export default defineApi({ auth: false, body: resetBody, message: "Password updated" }, ({ body }) => resetPassword(body.token, body.password));
