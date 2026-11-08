import { defineApi } from "@server/utils/api.js";
import { listSkills } from "@server/services/reference/reference.service.js";

export default defineApi({ auth: "any", cache: 60 }, () => listSkills());
