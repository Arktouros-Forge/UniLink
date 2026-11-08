import { defineApi } from "@server/utils/api.js";
import { lecturerRef } from "@server/services/reference/reference.service.js";
import { referenceQuery } from "@server/validators/reference.js";

export default defineApi(
  { auth: "admin", query: referenceQuery },
  ({ query }) => lecturerRef.page(query),
);
