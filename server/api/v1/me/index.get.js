import { defineApi } from "@server/utils/api.js";
import { getMe } from "@server/services/users/users.service.js";

export default defineApi({ auth: "any" }, ({ user }) => getMe(user.id));
