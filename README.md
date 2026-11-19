# UniLink

A campus collaboration web app built for **Universitas Udayana** students—find a study partner, post what you need help with, form competition teams with owner approval, and keep track of coursework in one place. Built for **TecFest 2026 (Software Engineering Division)**.

![Landing page](docs/screens/landing.png)

## Quick Links

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-unilink--tecfest.vercel.app-16449C?style=for-the-badge&logo=vercel&logoColor=white)](https://unilink-tecfest.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/GITHUB-Arktouros--Forge%2FUniLink-141414?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Arktouros-Forge/UniLink)
[![Pitch Deck](https://img.shields.io/badge/PITCH_DECK-Canva_Presentation-D92B2B?style=for-the-badge&logo=canva&logoColor=white)](https://canva.link/ckhc3df0fnbldok)
[![Design System](https://img.shields.io/badge/FIGMA-De_Stijl_Design_File-F4B41A?style=for-the-badge&logo=figma&logoColor=141414)](https://www.figma.com/design/cHIZSLnr7xjhSCfHojQg0M/UniLink---TecFest-2026?node-id=0-1&t=QCL5dOHjXWsbimLW-1)

---

## Run It Locally

You need [Bun](https://bun.sh) and a PostgreSQL database (we connected ours to **Supabase** using the **Direct Connection String**).

```bash
cp .env.example .env      # Fill in your DATABASE_URL (and mail/auth keys if testing full flows)
bun install
bun run db:reset          # Creates tables and seeds demo data
bun run dev               # Runs on http://localhost:3000
```

> **A quick heads-up on `.env`:**
> To test every feature locally, make sure your `.env` is filled in—naturally, we kept our own API keys out of the repo (`git push` regrets avoided). If you'd rather skip local setup, the [live deployment](https://unilink-tecfest.vercel.app/) already has everything wired up and ready to click through.

### Demo Logins

| Role | Email | Password |
| --- | --- | --- |
| Student | `alviro.malvin@unilink.test` | `Student123!` |
| Admin | `lyni@unilink.test` | `Admin123!` |

New accounts go through a quick onboarding flow (name, NIM, cohort year, skills, and WhatsApp). Once entered, **NIM is locked** to prevent impersonation.

* **Email delivery:** Verification and password-reset emails print straight to your terminal and appear at `/api/v1/dev/outbox` until you configure an email provider (see [Email Setup](https://www.google.com/search?q=%23email-setup)).
* **Google Sign-In:** Appears automatically once the Firebase variables in `.env.example` are filled; otherwise, standard email and password authentication handles everything.

---

## How It Works

```mermaid
flowchart LR
  B["Browser<br/>Nuxt pages, Pinia"] -->|"/api/v1"| R["Nitro routes<br/>defineApi"]
  R --> V["zod validation"]
  V --> S["services"]
  S --> D[("PostgreSQL<br/>Drizzle")]
  R -. "httpOnly JWT cookie" .- B
  S -. "verify, reset mail" .-> M["SMTP / Brevo / Resend"]
  B -. "optional" .-> F["Firebase Auth"]
  F -. "ID token" .-> R
```

Every backend endpoint is wrapped in `defineApi`, which verifies the session, validates payloads with Zod, and returns a consistent response envelope: `{ success, statusCode, message, data }`.

### Mutual-Consent Privacy (The Core Flow)

```mermaid
sequenceDiagram
  participant A as Alviro
  participant U as UniLink
  participant G as Agus
  A->>U: Ask Agus for help with SQL
  U-->>G: Pending request (Alviro's number hidden)
  G->>U: Accept
  U-->>A: Agus's number + WhatsApp link
  U-->>G: Alviro's number + WhatsApp link
```

Competition teams work the exact same way: students request to join, the team owner approves, and **only then** do phone numbers and WhatsApp links unlock for members.

---

## Interface & Screens

The UI follows a **De Stijl** visual language—flat primary color blocks, crisp borders, and zero glossy clutter.

|  |  |
| --- | --- |
| ![Dashboard](docs/screens/dashboard.png) | ![Study match](docs/screens/study-match.png) |
| ![Request modal](docs/screens/modal.png) | ![Help board](docs/screens/help-board.png) |
| ![Competitions](docs/screens/competitions.png) | ![Team](docs/screens/team.png) |
| ![Tasks](docs/screens/tasks.png) | ![Admin](docs/screens/admin.png) |

On mobile viewports, the navigation sidebar automatically adapts into a bottom bar:

![Mobile](docs/screens/mobile.png)

---

## Project Structure

```text
app/        Nuxt 4 pages, components, Pinia stores, and UI copy (constants/*.json)
server/     Nitro API routes, business services, Zod validators, email templates, Drizzle schema & seeds
postman/    Importable Postman collection and environment variables
docs/       UI screenshots
```

**Tech Stack:** Nuxt 4, Nitro, UnoCSS, Pinia, Drizzle ORM, PostgreSQL (Supabase), Zod, `jose` (httpOnly JWT), and `vue-sonner`.

---

## API & Postman Testing

1. Import `postman/UniLink.postman_collection.json` and `postman/UniLink.local.postman_environment.json` into Postman.
2. Select the imported environment and run **`00 Start here → Login (student)`** once.
3. The session cookie is saved automatically, so folders `00` through `08` can be executed sequentially—each request includes assertions and saved example responses.

Full endpoint documentation is available in [API.md](API.md), and client architecture notes live in [APP.md](APP.md).

---

## Handy Commands

| Command | What it does |
| --- | --- |
| `bun run dev` | Start the local development server |
| `bun run db:reset` | Wipe, migrate, and reseed DB (requires `ALLOW_DB_RESET="true"`) |
| `bun run db:seed` | Reseed an already migrated database |
| `bun run build` | Create a production build |

### UI Feedback & Error Handling

Every action surfaces toast feedback (`app/constants/toast.json` maps server responses to clean user-facing messages). Invalid form inputs highlight in red with inline reasons and automatically focus the first field that needs attention.

---

## Email Setup

Configure **one** provider in `.env` (the app picks the first available one; if none are set, emails log to the terminal).

| Provider | Required Variables | Notes |
| --- | --- | --- |
| **Brevo** *(Recommended)* | `BREVO_API_KEY`, `MAIL_FROM="UniLink <you@gmail.com>"` | Free tier (300 emails/day). No custom domain needed—just verify your sender email in Brevo. |
| **Gmail / SMTP** | `SMTP_URL="smtps://you%40gmail.com:APP_PASSWORD@smtp.gmail.com:465"` | Free with 2FA + Google App Password. URL-encode `@` as `%40` in the username. |
| **Resend** | `RESEND_API_KEY`, `MAIL_FROM` | Requires a verified custom domain to send to external recipients. |

> **Tip:** If you want the quickest setup, go with **Brevo**—just make sure **`MAIL_FROM=`** is always filled in whenever you enable any email provider in `.env`.

---

## Troubleshooting & Dev Notes (M)

* **Fonts falling back in dev mode?** If you restart or toggle `bun run dev` repeatedly while tweaking things, the external font server may temporarily rate-limit requests and fall back to system fonts. It's just the font server telling us to take a breather, not a bug in the CSS—production builds (`bun run build`) fetch fonts normally.
* **Database connection:** Tested and verified with **Supabase** using its **Direct Connection String** (`DATABASE_URL`).
