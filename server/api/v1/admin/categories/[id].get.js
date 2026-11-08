import { defineApi } from "@server/utils/api.js";
import { categoryRef } from "@server/services/reference/reference.service.js";
import { idParam } from "@server/validators/common.js";

export default defineApi({ auth: "admin", params: idParam }, ({ params }) =>
  categoryRef.get(params.id),
);
