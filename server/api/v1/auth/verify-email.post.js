import { defineApi } from "@server/utils/api.js";
import { verifyEmail } from "@server/services/auth/auth.service.js";
import { tokenBody } from "@server/validators/auth.js";

export default defineApi({ auth: false, body: tokenBody, message: "Email verified" }, ({ body }) => verifyEmail(body.token));
