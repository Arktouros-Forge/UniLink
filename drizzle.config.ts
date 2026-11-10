import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const raw = process.env.DATABASE_URL!;
const flag = process.env.DATABASE_SSL?.trim().toLowerCase();
const isLocal = /@(localhost|127\.0\.0\.1|\[::1\]|host\.docker\.internal)(:|\/|$)/.test(raw);
const wantsSsl = flag === "true" || (flag !== "false" && !isLocal);
const url = wantsSsl && !/sslmode=/.test(raw) ? `${raw}${raw.includes("?") ? "&" : "?"}sslmode=require` : raw;

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/database/schema/index.ts",
  out: "./server/database/migrations",

  dbCredentials: { url },

  strict: true,
  verbose: true,
});
