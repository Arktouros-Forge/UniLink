import { defineApi } from "@server/utils/api.js";
import { getSkillWithHolders } from "@server/services/reference/reference.service.js";
import { idParam } from "@server/validators/common.js";

export default defineApi({ auth: "any", params: idParam }, ({ params }) =>
  getSkillWithHolders(params.id),
);
