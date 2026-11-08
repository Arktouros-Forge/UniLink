import { defineApi } from "@server/utils/api.js";
import { listLecturers } from "@server/services/reference/reference.service.js";

export default defineApi({ cache: 60 }, () => listLecturers());
