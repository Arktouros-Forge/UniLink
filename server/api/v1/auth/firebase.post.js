import { getRequestIP } from "h3";

import { defineApi, ok } from "@server/utils/api.js";
import { issueSession } from "@server/utils/session.js";
import { firebaseLogin } from "@server/services/auth/auth.service.js";
import { firebaseBody } from "@server/validators/auth.js";

export default defineApi(
  { auth: false, body: firebaseBody },
  async ({ event, body }) => {
    const user = await firebaseLogin(
      body,
      getRequestIP(event, { xForwardedFor: true }) ?? "unknown",
    );
    await issueSession(event, user, { remember: body.remember });
    return ok({ id: user.id, role: user.role }, "Logged in");
  },
);
