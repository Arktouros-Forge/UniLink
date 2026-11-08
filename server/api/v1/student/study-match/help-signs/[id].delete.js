import { defineApi } from "@server/utils/api.js";
import { deleteSign } from "@server/services/study-match/study-match.service.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  { params: idParam, message: "Help sign deleted" },
  ({ user, params }) => deleteSign(user.id, params.id),
);
