# UniLink

A small web app for Universitas Udayana students: find someone to study with, post what you need help with, put a team together for a competition, and keep your week in order. Built for TecFest 2026.

![Landing page](docs/screens/landing.png)

The one rule that shapes everything: **phone numbers stay hidden until a request is accepted.** After that, the other person gets your number and a WhatsApp link. There is no chat inside the app on purpose.

## Run it

You need [Bun](https://bun.sh) and a PostgreSQL database.

```bash
cp .env.example .env      # put your DATABASE_URL in it, nothing else is required
bun install
bun run db:reset          # creates tables and fills demo data
bun run dev               # http://localhost:3000
```

Demo logins:

| Role    | Email                       | Password       |
| ------- | --------------------------- | -------------- |
| Student | `ayu.pramesti@unilink.test` | `Student123!`  |
| Admin   | `admin@unilink.test`        | `Admin123!`    |

Emails (verification, password reset) are printed to the terminal and listed at `/api/v1/dev/outbox` until you add a `RESEND_API_KEY`. Google sign-in appears only when the Firebase variables in `.env.example` are filled in; without them the app uses its own email and password login.

## How it works

```mermaid
flowchart LR
  B["Browser<br/>Nuxt pages, Pinia"] -->|"/api/v1"| R["Nitro routes<br/>defineApi"]
  R --> V["zod validation"]
  V --> S["services"]
  S --> D[("PostgreSQL<br/>Drizzle")]
  R -. "httpOnly JWT cookie" .- B
  S -. "verify, reset mail" .-> M["Resend"]
  B -. "optional" .-> F["Firebase Auth"]
  F -. "ID token" .-> R
```

Every route is wrapped in `defineApi`, which checks the session, validates input and returns the same envelope: `{ success, statusCode, message, data }`.

The study-match flow, which is the heart of the app:

```mermaid
sequenceDiagram
  participant A as Ayu
  participant U as UniLink
  participant G as Agus
  A->>U: Ask Agus for help with SQL
  U-->>G: Pending request (Ayu's number hidden)
  G->>U: Accept
  U-->>A: Agus's number + WhatsApp link
  U-->>G: Ayu's number + WhatsApp link
```

Teams work the same way: you ask to join, the owner accepts, and only then do members see each other's numbers.

## Screens

| | |
| --- | --- |
| ![Dashboard](docs/screens/dashboard.png) | ![Study match](docs/screens/study-match.png) |
| ![Request modal](docs/screens/modal.png) | ![Help board](docs/screens/help-board.png) |
| ![Competitions](docs/screens/competitions.png) | ![Team](docs/screens/team.png) |
| ![Timetable](docs/screens/timetable.png) | ![Admin](docs/screens/admin.png) |

On a phone the sidebar becomes a bottom bar:

![Mobile](docs/screens/mobile.png)

## Where things are

```
app/        Nuxt pages, components, Pinia stores, copy in constants/*.json
server/     api routes, services (the logic), validators, emails, Drizzle schema + seeds
postman/    importable collection and environment
docs/       screenshots
```

Stack: Nuxt 4, UnoCSS, Pinia, Drizzle, PostgreSQL, zod, jose, vue-sonner. The visual design is a De Stijl take from Figma: flat colour blocks, thick outlines, nothing glossy.

## API

Import `postman/UniLink.postman_collection.json` and `postman/UniLink.local.postman_environment.json` into Postman, pick the environment, and run **Auth → Login (student)** once. The cookie is stored for you and every other request just works. All routes are also listed in [API-TREE.md](API-TREE.md).

## Handy commands

| Command            | What it does                                              |
| ------------------ | --------------------------------------------------------- |
| `bun run dev`      | start the app                                             |
| `bun run db:reset` | wipe, migrate and reseed (needs `ALLOW_DB_RESET="true"`)  |
| `bun run db:seed`  | reseed an already migrated database                       |
| `bun run build`    | production build                                          |

Before deploying: set `AUTH_SECRET` (32+ random characters), `APP_URL`, `NUXT_PUBLIC_SITE_URL`, a `RESEND_API_KEY`, and `ALLOWED_EMAIL_DOMAINS` if you want to limit sign-ups to campus addresses.
