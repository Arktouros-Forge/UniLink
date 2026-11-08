import { getRequestIP } from "h3";

import { defineApi } from "@server/utils/api.js";
import { forgotPassword } from "@server/services/auth/auth.service.js";
import { forgotBody } from "@server/validators/auth.js";

export default defineApi({ auth: false, body: forgotBody, message: "If the email exists, a reset link has been sent" }, ({ event, body }) =>
  forgotPassword(body.email, getRequestIP(event, { xForwardedFor: true }) ?? "unknown"),
);
