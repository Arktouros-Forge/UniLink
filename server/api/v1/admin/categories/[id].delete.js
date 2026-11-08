import { defineApi } from "@server/utils/api.js";
import { categoryRef } from "@server/services/reference/reference.service.js";
import { forceQuery } from "@server/validators/reference.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  {
    auth: "admin",
    params: idParam,
    query: forceQuery,
    message: "Category deleted",
  },
  ({ params, query }) => categoryRef.remove(params.id, query.force),
);
