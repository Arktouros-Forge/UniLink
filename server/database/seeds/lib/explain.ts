const HINTS: Array<[(error: any) => boolean, string]> = [
  [
    (e) => e?.code === "ECONNREFUSED" || e?.code === "CONNECT_TIMEOUT",
    "Cannot reach PostgreSQL. Start it and check the host and port in DATABASE_URL.",
  ],
  [
    (e) => /does not support SSL|secure TLS|SSL/i.test(String(e?.message)) || (e?.code === "ECONNRESET" && !e?.host),
    'The server has no SSL. Set DATABASE_SSL="false" in .env (local databases usually need this).',
  ],
  [
    (e) => e?.code === "28P01" || e?.code === "28000",
    "Wrong database user or password in DATABASE_URL.",
  ],
  [
    (e) => e?.code === "3D000",
    "The database in DATABASE_URL does not exist. Create it first, for example: createdb unilink",
  ],
  [
    (e) => e?.code === "42P01",
    "Tables are missing. Run `bun run db:reset` (clean start) or `bun run db:migrate`.",
  ],
  [
    (e) => e?.code === "42501",
    "This database user lacks permission. Use the owner account or a fresh database.",
  ],
  [
    (e) => /ALLOW_DB_RESET/.test(String(e?.message)),
    'Set ALLOW_DB_RESET="true" in .env, then run the command again.',
  ],
  [
    (e) => /DATABASE_URL is not configured/.test(String(e?.message)),
    "Copy .env.example to .env and fill in DATABASE_URL.",
  ],
];

export function explain(error: unknown) {
  const match = HINTS.find(([test]) => test(error));
  return match ? `  → ${match[1]}` : "";
}
