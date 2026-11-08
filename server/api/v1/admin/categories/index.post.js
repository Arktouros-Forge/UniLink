import { defineApi, ok } from "@server/utils/api.js";
import { categoryRef } from "@server/services/reference/reference.service.js";
import { categoryBody } from "@server/validators/reference.js";

export default defineApi(
  { auth: "admin", body: categoryBody },
  async ({ body }) =>
    ok(await categoryRef.create(body), "Category created", 201),
);
