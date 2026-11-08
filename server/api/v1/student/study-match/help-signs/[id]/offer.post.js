import { defineApi, ok } from "@server/utils/api.js";
import { offerHelp } from "@server/services/study-match/study-match.service.js";
import { offerBody } from "@server/validators/study-match.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  { params: idParam, body: offerBody },
  async ({ user, params, body }) =>
    ok(await offerHelp(user.id, params.id, body), "Offer sent", 201),
);
