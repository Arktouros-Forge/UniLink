import { eq } from "drizzle-orm";
import { db } from "@database/index";
import { users } from "@database/schema/index";

export async function changeUserEmail(userId, currentPassword, newEmail) {
  const [user] = await db
    .select({
      id: users.id,
      password: users.password,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    return { success: false, reason: "USER_NOT_FOUND" };
  }

  const validPassword = await Bun.password.verify(
    currentPassword,
    user.password,
  );

  if (!validPassword) {
    return { success: false, reason: "INVALID_CURRENT_PASSWORD" };
  }

  try {
    const [updatedUser] = await db
      .update(users)
      .set({
        email: newEmail,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
      });

    if (!updatedUser) {
      return { success: false, reason: "USER_NOT_FOUND" };
    }

    return { success: true, data: updatedUser };
  } catch (error) {
    if (error.code === "23505") {
      return { success: false, reason: "EMAIL_ALREADY_IN_USE" };
    }

    throw error;
  }
}

export async function changeUserPassword(userId, currentPassword, newPassword) {
  const [user] = await db
    .select({
      id: users.id,
      password: users.password,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    return { success: false, reason: "USER_NOT_FOUND" };
  }

  const validPassword = await Bun.password.verify(
    currentPassword,
    user.password,
  );

  if (!validPassword) {
    return { success: false, reason: "INVALID_CURRENT_PASSWORD" };
  }

  const hashedPassword = await Bun.password.hash(newPassword);

  await db
    .update(users)
    .set({
      password: hashedPassword,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return {
    success: true,
    data: { message: "Password changed successfully" },
  };
}
