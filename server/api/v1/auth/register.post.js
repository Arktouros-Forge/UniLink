import { defineApi, ok } from "@server/utils/api.js";
import { issueSession } from "@server/utils/session.js";
import { register } from "@server/services/auth/auth.service.js";
import { registerBody } from "@server/validators/auth.js";

export default defineApi(
  { auth: false, body: registerBody },
  async ({ event, body }) => {
    const user = await register(body);
    await issueSession(event, user);
    return ok(
      { id: user.id, role: user.role, emailVerified: false },
      "Account created. Check your email to verify.",
      201,
    );
  },
);
