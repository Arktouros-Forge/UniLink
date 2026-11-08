import { defineApi } from "@server/utils/api.js";
import { lecturerRef } from "@server/services/reference/reference.service.js";
import { lecturerPatch } from "@server/validators/reference.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  {
    auth: "admin",
    params: idParam,
    body: lecturerPatch,
    message: "Lecturer updated",
  },
  ({ params, body }) => lecturerRef.update(params.id, body),
);
