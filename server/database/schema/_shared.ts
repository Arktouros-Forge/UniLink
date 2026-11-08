import { timestamp } from "drizzle-orm/pg-core";

export const tz = (name: string) => timestamp(name, { withTimezone: true });

export const createdAt = () => tz("created_at").notNull().defaultNow();

export const updatedAt = () =>
  tz("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());
