import { defineApi } from "@server/utils/api.js";
import { sendVerification } from "@server/services/auth/auth.service.js";

export default defineApi({ auth: "any", message: "Verification email sent" }, ({ user }) => sendVerification(user.id));
