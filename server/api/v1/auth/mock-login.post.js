import { defineApi, ok } from "@server/utils/api.js";
import { issueSession } from "@server/utils/session.js";
import { fail } from "@server/utils/errors.js";
import { mockLogin } from "@server/services/users/users.service.js";
import { mockLoginBody } from "@server/validators/users.js";

export default defineApi(
  { auth: false, body: mockLoginBody },
  async ({ event, body }) => {
    if (!import.meta.dev) fail("NOT_FOUND");

    const user = await mockLogin(body);

    await issueSession(event, user);

    return ok(user, `Logged in as ${user.fullName}`);
  },
);
