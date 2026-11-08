# UniLink API

Base path `/api/v1`. Every response uses one envelope:

```json
{ "success": true, "statusCode": 200, "message": "Success", "data": {}, "timestamp": "..." }
{ "success": false, "statusCode": 422, "message": "Invalid request body", "data": null, "errors": [{ "field": "title", "message": "..." }] }
```

Paginated lists return `data.pagination = { page, limit, total, totalPages }`.

Auth is a dev-only cookie set by `POST /auth/mock-login` (`{ "role": "student" | "admin" }` or `{ "userId": "..." }`).
Swap `resolveSession` in `server/utils/auth.js` for real authentication later; nothing else changes.

## Routes

| Area | Routes |
| --- | --- |
| Auth | `POST auth/mock-login` `POST auth/logout` `GET health` |
| Me | `GET/PATCH me` `PATCH me/email` `PATCH me/password` |
| Student | `GET student/dashboard` |
| Directory | `GET student/users` `GET student/users/:id` `GET student/skills[/:id]` `GET student/categories` `GET student/lecturers` |
| Competitions | `GET/POST student/competitions` `GET/PATCH/DELETE student/competitions/:id` |
| Teams | `GET/POST student/teams` `GET/PATCH/DELETE student/teams/:id` `POST :id/join` `DELETE :id/leave` `GET :id/members` `GET :id/requests` `PATCH :id/members/:userId` `PATCH :id/result` |
| Tasks | `GET/POST student/tasks` `PATCH/DELETE student/tasks/:id` `DELETE student/tasks/completed` |
| Timetable | `GET/POST student/timetable/events` `PATCH/DELETE .../events/:id` `POST timetable/import` `GET timetable/export?format=json\|ics` `DELETE timetable/clear` |
| Study match | `GET study-match/search` `GET study-match/history` `GET/POST study-match/help-signs` `GET/PATCH/DELETE help-signs/:id` `POST help-signs/:id/offer` `GET/POST study-match/requests` `GET/PATCH/DELETE requests/:id` |
| Admin | `GET admin/dashboard` `GET/PATCH/DELETE admin/users[/:id]` `PATCH admin/users/:id/status` `CRUD admin/skills` `CRUD admin/categories` `CRUD admin/lecturers` `CRUD admin/competitions` |

## Layout

```
server/
  api/v1/**            one file per route, 5-12 lines each
  services/<domain>/   business logic, all SQL
  validators/          zod schemas (params, query, body)
  utils/api.js         defineApi({ auth, params, query, body }, handler)
  utils/errors.js      error catalogue, ApiError, Postgres error mapping
  utils/auth.js        session lookup with a 10 s in-memory cache
  database/schema/     Drizzle tables, indexes, constraints
  database/seeds/      deterministic Indonesian demo data
```

## Design notes

- Services throw `fail("CODE")`; `defineApi` maps it to status and message. Transactions roll back automatically.
- List endpoints use one query: `count(*) over()` for the total and `json_agg` sub-selects for skills, categories and members.
- Reference data (skills, categories, lecturers) is cached for 60 s and cleared on admin writes.
- Race-prone rules are enforced in the database: one accepted team per competition, one pending request per pair and subject, no overlapping event times, case-insensitive unique email.
- Request and help-sign expiry is computed in SQL, so no cron job is required.

## Database commands

```
bun run db:generate   bun run db:migrate   bun run db:seed   bun run db:reset
```

Seed accounts: `ayu.pramesti@unilink.test / Student123!` and `admin@unilink.test / Admin123!`.
`SEED_STUDENTS`, `SEED_VALUE` and `SEED_NOW` env vars change size, randomness and the reference date.
Use `DATABASE_SSL=false` for a local Postgres and `DATABASE_PREPARE=false` behind a Supabase transaction pooler.


## Auth, sessions and email

| Route | Purpose |
| --- | --- |
| `POST /auth/register` | Create account, set session cookie, send verification email |
| `POST /auth/login` | Rate limited (8 / 15 min per email+IP). `remember` extends the cookie to 30 days |
| `POST /auth/logout` | Clears the cookie |
| `POST /auth/verify-email` | `{ token }`, single use, valid 24 h |
| `POST /auth/resend-verification` | Signed-in, unverified users, 5 / hour |
| `POST /auth/forgot` | Always answers the same message, 3 / hour per email+IP |
| `POST /auth/reset` | `{ token, password }`, valid 30 min, signs out every other device |
| `GET /dev/outbox` | Dev only. Last 50 emails that were sent or logged |

- Session: HS256 JWT (jose) in the httpOnly cookie `unilink_session`, payload `{ role, v }`. `users.sessionVersion` is bumped on password change or reset, which invalidates older cookies.
- Unverified accounts can only use `auth: "any"` routes (`/me`, `/auth/*`). Student and admin routes need a verified email.
- Email: Resend REST API (free tier, 3,000 mails / month). Set `RESEND_API_KEY` and `MAIL_FROM`. Without a key, mails are printed to the server log and kept in the dev outbox. Templates live in `server/emails/` (De Stijl HTML + plain text).
- Env: `AUTH_SECRET` (min 32 chars, required in production), `APP_URL`, `MAIL_FROM`, `RESEND_API_KEY`, `ALLOWED_EMAIL_DOMAINS` (optional comma list, for example `student.unud.ac.id`).

## Frontend wiring

- `plugins/auth.js` loads `/me` once per request into `stores/auth.js`.
- `middleware/auth.js`: not signed in -> login (with `?redirect`), blocked -> `/auth/blocked`, unverified -> `/auth/verify-email`, not onboarded -> `/onboarding/1`, wrong area -> own home. Pages that must stay reachable mid-flow set `allowIncomplete`.
- `middleware/guest.js` keeps signed-in users off the auth pages.
- `useApi`, `useApiData` (lazy fetch with explicit id), `useAction` (loading, field errors, toast).

## Firebase Auth (optional)

Set `NUXT_PUBLIC_FIREBASE_API_KEY`, `NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NUXT_PUBLIC_FIREBASE_PROJECT_ID`, `NUXT_PUBLIC_FIREBASE_APP_ID` and `FIREBASE_PROJECT_ID`. Enable Email/Password and Google in the Firebase console and add your domain under Authorized domains.

- `POST /auth/firebase { idToken, name?, remember? }` verifies the Firebase ID token (RS256, Google JWKS, issuer/audience = project id), finds or creates the user by email, stores `firebaseUid`, copies `email_verified`, and sets the `unilink_session` cookie.
- Client: login (password with local fallback for accounts that have no Firebase user, plus Google popup), register (`createUserWithEmailAndPassword` + `sendEmailVerification`), forgot (`sendPasswordResetEmail`), verify-email ("Saya sudah verifikasi" refreshes the token and re-posts).
- Without the public config the app uses the local JWT + Resend flow unchanged.
