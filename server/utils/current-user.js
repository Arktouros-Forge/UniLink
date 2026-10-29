import { getCookie } from "h3";
import { getUserById } from "@server/services/users/users.service.js";

export async function getCurrentUser(event) {
  if (!import.meta.dev) return null;

  const userId = getCookie(event, "unilink_test_user");

  if (!userId) return null;

  return getUserById(userId);
}
