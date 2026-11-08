import { defineApi } from "@server/utils/api.js";
import { lecturerRef } from "@server/services/reference/reference.service.js";
import { forceQuery } from "@server/validators/reference.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  {
    auth: "admin",
    params: idParam,
    query: forceQuery,
    message: "Lecturer deleted",
  },
  ({ params, query }) => lecturerRef.remove(params.id, query.force),
);
