import { defineApi } from "@server/utils/api.js";
import { categoryRef } from "@server/services/reference/reference.service.js";
import { categoryPatch } from "@server/validators/reference.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  {
    auth: "admin",
    params: idParam,
    body: categoryPatch,
    message: "Category updated",
  },
  ({ params, body }) => categoryRef.update(params.id, body),
);
