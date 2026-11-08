import { defineApi } from "@server/utils/api.js";
import { listStudents } from "@server/services/users/users.service.js";
import { studentsQuery } from "@server/validators/users.js";

export default defineApi({ query: studentsQuery }, ({ user, query }) =>
  listStudents({ ...query, excludeId: user.id }),
);
