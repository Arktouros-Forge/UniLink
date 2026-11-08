import { index, pgEnum, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { createdAt, tz } from "./_shared";
import { users } from "./users";

export const authTokenTypeEnum = pgEnum("auth_token_type", [
  "verify_email",
  "reset_password",
]);

export const authTokens = pgTable(
  "auth_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    type: authTokenTypeEnum("type").notNull(),
    tokenHash: text("token_hash").notNull(),

    expiresAt: tz("expires_at").notNull(),
    usedAt: tz("used_at"),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("auth_tokens_hash_unique").on(t.tokenHash),
    index("auth_tokens_user_type_idx").on(t.userId, t.type),
  ],
);
