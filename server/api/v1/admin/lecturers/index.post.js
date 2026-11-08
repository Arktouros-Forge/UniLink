import { defineApi, ok } from "@server/utils/api.js";
import { lecturerRef } from "@server/services/reference/reference.service.js";
import { lecturerBody } from "@server/validators/reference.js";

export default defineApi(
  { auth: "admin", body: lecturerBody },
  async ({ body }) =>
    ok(await lecturerRef.create(body), "Lecturer created", 201),
);
