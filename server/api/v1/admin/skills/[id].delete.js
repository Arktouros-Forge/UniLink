import { defineApi } from "@server/utils/api.js";
import { skillRef } from "@server/services/reference/reference.service.js";
import { forceQuery } from "@server/validators/reference.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  {
    auth: "admin",
    params: idParam,
    query: forceQuery,
    message: "Skill deleted",
  },
  ({ params, query }) => skillRef.remove(params.id, query.force),
);
