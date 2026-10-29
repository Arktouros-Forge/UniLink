# UniLink — Project Guide & Technical Specification (v5)

> **Version:** 5.0  
> **Purpose:** Detailed reference for building the UniLink MVP for TecFest 2026 Software Engineering.  
> **Status:** Ready for proposal writing and development sprint planning.  
> **Changes from v4:**
>
> - **Skills** are a separate admin-managed table linked to users via a junction table (many-to-many). The `users.skills` array is removed.
> - **Angkatan (year)** is a Postgres enum, not a free integer.
> - **Competition categories** are a separate admin-managed table linked to competitions via a junction table (a competition can have one or more categories).
> - **Competitions** now carry an **image**, a **source URL**, and a **host** field.
> - **Teams** no longer have roles. `teams.required_roles` and `team_members.role_in_team` are removed.
> - **Timetable events** link to a **lecturer** from a new admin-managed `lecturers` table (name, email, phone, profile, bio, NIDN).
> - **Admin** can now fully manage skills, categories, lecturers, competitions, and users (edit + block/unblock + delete), plus view analytics.

---

## 1. What Is UniLink

UniLink is a campus collaboration web app for university students. It helps students find academic help and form competition teams without juggling scattered group chats.

Students create a profile during onboarding. The profile lists which skills they can help with, selected from an admin-managed list. Other students can find them through **Study Match** when they need help with a class, or through **Competition Match** when they want to join a team for a competition.

Study Match has two directions:

1. **Search-based (requester-driven):** a student searches by skill, finds peers whose skills match, and sends a request directly.
2. **Sign-based (helper-driven):** a student posts a **Help Sign** for a skill they're stuck on. Capable students browse the Help Signs board and offer help directly. The poster accepts or declines.

Both directions use the same outcome: once a request or offer is accepted, both sides get a "Contact via WhatsApp" button and continue the conversation outside UniLink.

UniLink does not host conversations. Once a helper accepts a study request, or a team accepts a new member, both sides are redirected to an external messaging app (WhatsApp) using the phone number they registered with.

The app has two roles: **Student** and **Admin**. Students use the core features (profile, task, timetable, study match, competition match). Admins manage the platform's reference data (skills, categories, lecturers, competitions), manage users (edit, block, delete), and view analytics. Admins do not use the timetable.

Competitions can be created by admins or by students. Student-created competitions carry minimal info because the student may know about a competition before the admin does. Admin can edit or delete any competition, including student-created ones.

The core features are: **User/Profile**, **Task**, **Timetable**, **Study Match** (search + signs), and **Competition Match**. Documents, Todoist sync, in-app messaging, notifications, real-time SSO, and AI-generated competitions are out of scope for the MVP.

---

## 2. Roles and Permissions

| Role        | How created              | Can do                                                                                                                                                                                                              | Cannot do                                                                                                |
| ----------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Student** | Self-register via signup | Manage own profile, tasks, timetable; browse and request Study Match (search + signs); post Help Signs; browse and offer help; browse, create, and join Competition Teams; create competitions; report team results | Manage reference data (skills, categories, lecturers); block or delete users; edit other users' profiles |
| **Admin**   | Seeded into the database | Manage **skills** (CRUD), **categories** (CRUD), **lecturers** (CRUD), **competitions** (CRUD incl. student-created), **users** (edit profile fields, block/unblock, delete); view analytics dashboard              | Have a timetable or tasks; post Help Signs; offer help; create study requests or teams                   |

There is no Korti role in the MVP. If a room availability feature is added later, a Korti role can be introduced then (Section 9).

**Admin account** is created by a seed migration. Admin email verification is optional for MVP. Login uses email and password.

**Blocked users** cannot log in. They see a message with the reason if the admin provided one.

**Deleted users** are hard-deleted with a cascade. Their tasks, timetable events, study requests, Help Signs, teams, and team memberships are removed. Teams they created are deleted or have ownership transferred per Section 4.11.

**Admin editing a user** can change: full name, year, phone, skills, personal website, profile photo, and NIM (with a warning). Admin cannot change username or email (user-only). Admin can trigger a password reset email but cannot see or set the password.

---

## 3. Core Features

### 3.1 User / Profile (F1)

Every student has a profile created during onboarding. Fields:

- Username (unique, locked after signup)
- Full name
- NIM (student ID number, unique, editable by admin only after onboarding)
- Email (verified; user-only changes with re-verification)
- Phone number (used for Study Match and Competition contact, normalized to `+62`)
- **Year / angkatan** — selected from a fixed enum (`cohort_year`): 2018 through 2030.
- **Skills** — selected from the admin-managed `skills` table, stored in the `user_skills` junction table. A user can have 0–20 skills. Skills drive Study Match discovery and the "you can help" badge on signs. Empty skills = user won't appear in search results but can still browse signs and offer help.
- Personal website (optional, validated as URL starting with `http://` or `https://`)
- Profile photo (optional, falls back to initials avatar)

Skill changes immediately affect Study Match discovery and sign matching. Profile edits are available from Settings (user) and from the Admin → Users page (admin).

### 3.2 Task (F2)

Each student has a private task list. Tasks are visible only to the owner.

- Create, edit, delete, mark complete
- Fields: title, notes, due date, priority (low, medium, high)
- Filter by status (all, pending, done)
- No sharing, no sync to other apps in the MVP

### 3.3 Timetable (F3)

Each student has a private weekly timetable. Timetables are visible only to the owner. **One semester at a time.** Switching semesters = export then clear then import.

- Manual entry: course code, title, day, start time, end time, room, **lecturer** (selected from the admin-managed `lecturers` table, optional), weekly recurrence
- Import ICS
- Import JSON (StudentPlanner format — see Section 5.3)
- Export ICS
- Export JSON (StudentPlanner format, includes lecturer details)
- Weekly grid view with color-coded courses
- Conflict warning when a new event overlaps an existing event (warn but allow)
- "Clear semester" action that deletes all events after a confirmation modal

### 3.4 Study Match (F4) — for academic help

Study Match has two directions. Both are available to every student.

#### Direction A — Search-based (requester-driven)

- Requester searches by **skill name** (from the `skills` table). The search input is a typeahead over managed skills; the requester picks one or more skills.
- System returns students who have at least one of the selected skills in `user_skills`.
- Each result card shows: username, full name, year, and the matching skills as chips.
- Requester views the helper's profile: username, full name, year, skills, **phone number**. Email and personal website are hidden in this context.
- Requester sends a study request with a short description and optional preferred time.
- Helper sees the request in their inbox. No push notifications in MVP — the helper sees a count on the Study Match page.
- Helper accepts or declines.
- **If accepted:** status becomes `accepted`. Both sides see a "Contact via WhatsApp" button. The request moves to "Accepted" in both inboxes.
- **If declined:** status becomes `declined`. Requester sees the decline in History.
- **If unanswered after 7 days:** status becomes `expired`, soft-deleted. Visible only in History/Log.
- Requester can cancel a pending request.

#### Direction B — Sign-based (helper-driven)

- Poster creates a **Help Sign** with:
  - **Skill** — selected from the `skills` table (required). This is the matching field.
  - **Title** — one-line summary (free text).
  - **Description** — what they've tried, what's confusing (free text).
  - **Preferred time** — optional.
- The sign is published immediately to the **Help Signs board** visible to all logged-in students. It stays open for **14 days** unless fulfilled or closed earlier.
- Capable students browse the board. Filters: by skill, by "matches my skills" toggle.
- Students whose `user_skills` includes the sign's skill see a "you can help" badge on the sign card.
- A helper clicks "Offer help." Modal opens with a short message field.
- This creates a `study_request` with `initiated_by = 'helper'`, `sign_id = the sign`, status `pending`.
- The poster sees the offer in their inbox as an **incoming offer**. They accept or decline.
- **If accepted:** status becomes `accepted`. The sign becomes `fulfilled` automatically. All other pending offers on the same sign are auto-declined with status `cancelled`. Both sides see a "Contact via WhatsApp" button.
- **If declined:** status becomes `declined`. The sign stays open. The helper sees the decline in History.
- **If unanswered after 7 days:** the offer expires (soft-deleted). The sign stays open.
- The poster can manually **close** their sign at any time. All pending offers become `cancelled`.

#### Shared rules for both directions

- **History/Log page** lists all past study requests and offers (accepted, declined, expired, cancelled), with status, dates, and the other party's name.
- **Rate limits** (server-enforced — Section 4.12):
  - Max 5 pending outgoing search-based requests at a time.
  - Max 5 pending outgoing helper offers at a time.
  - Max 20 outgoing actions per day (requests + offers combined).
  - Max 3 active Help Signs per student.
  - Max 3 new Help Signs per week.

### 3.5 Competition Match (F5) — for competition teams

**Competition list:**

- Published competitions appear in a public list for all logged-in students.
- Each competition shows: **image**, title, description, **categories** (one or more chips), **host**, deadline, **source URL** (link to the official competition page), creator (admin or student), and number of teams.
- Student-created competitions show minimal info (title, categories, deadline, short description, optional image, optional source URL). Admin can edit or delete any competition.

**Competition fields:**

- Title (required)
- Description (required)
- **Categories** — one or more, selected from the admin-managed `categories` table (via `competition_categories` junction)
- Deadline (required)
- **Host** — text (required): e.g., "Universitas Udayana", "Himpunan Mahasiswa Informatika", "Dicoding"
- **Source URL** — external link to the official competition page (optional, validated)
- **Image** — cover image uploaded to Supabase Storage `competition-images` bucket (optional; falls back to a category-colored placeholder)
- `max_team_size` (optional, set by creator)
- Status: draft / published / closed

**Team list per competition:**

- Any student can create a team for a published competition.
- A team is **always public** once created.
- A team page shows: team name, description, creator, current members, max members.
- Other students can browse teams per competition and request to join.

**Team rules:**

- A student can be in **at most one team per competition**. Must leave current team before joining another.
- A student can create **at most one team per competition**.
- Team size limit: `competition.max_team_size` (optional, set by competition creator) and `teams.max_members` (set by team creator, cannot exceed `max_team_size` if it exists).
- **Teams have no roles.** `teams.required_roles` and `team_members.role_in_team` are removed. Members are simply members.
- Team creator accepts or declines join requests.
- Once accepted, the new member's name, NIM, and phone appear on the team page.
- Team creator can remove members, edit team details, and delete the team.

**After the competition deadline:**

- Any team member (or admin) can report the result: **won, lost, or unknown**. Unreported = unknown.
- The result appears on the team page and in the competition detail as a badge.

### 3.6 Admin (F6) — management and analytics

Admins can manage the platform's reference data and users. Admins do not have a timetable, tasks, signs, or team memberships.

**Skills management** (`/admin/skills`):

- List all skills with name, slug, description, usage count (how many users have it).
- Create, edit, delete a skill.
- Deleting a skill cascades `user_skills` and `help_signs.skill_id` (SET NULL on signs if nullable, or CASCADE — see Section 5).
- Seed the initial skill list via migration.

**Categories management** (`/admin/categories`):

- List all categories with name, slug, description, color, usage count (how many competitions use it).
- Create, edit, delete a category.
- Deleting a category cascades `competition_categories`.
- Seed initial categories via migration.

**Lecturers management** (`/admin/lecturers`):

- List all lecturers with name, email, phone, NIDN, bio.
- Create, edit, delete a lecturer.
- Deleting a lecturer sets `timetable_events.lecturer_id` to NULL.

**Competitions management** (`/admin/competitions`):

- List all competitions (admin-created and student-created) with status, creator, deadline, category count, team count.
- Create, edit, publish, unpublish, delete.
- Edit fields: title, description, categories, image, host, source URL, deadline, max team size, status.

**Users management** (`/admin/users`):

- Table of all students: username, full name, NIM, email, phone, year, skills count, registration date, status.
- Search by username, NIM, email, or skill.
- Filter by status (active/blocked) and year.
- **Edit user**: full name, year, phone, skills (via junction), personal website, profile photo, NIM (with warning that this is normally user-only). Cannot edit username or email. Can trigger a password reset email.
- Block a user (optional reason).
- Unblock a user.
- Delete a user (confirmation modal, cascade).

**Analytics dashboard:**

- Total students registered
- Active students (logged in within 7 days)
- Total competitions (published, draft, closed; admin-created vs student-created)
- Total teams per competition (top 5)
- Total study requests (pending, accepted, declined, expired), split by direction (search vs sign)
- Total Help Signs (open, fulfilled, closed, expired)
- Total skills and categories
- Total lecturers
- Reported results (won, lost, unknown)

### 3.7 Settings (F7)

- Account: change password, change email (requires re-verification), logout.
- Profile: edit full name, year, skills, phone, personal website, profile photo.
- No notification settings (no notification system in MVP).
- Account deletion by the student (confirmation modal + cascade).

---

## 4. Detailed Flows

### 4.1 Onboarding Flow

1. Student lands on signup page.
2. Fills in: username, email, password, confirm password.
3. Submits. System sends email verification link.
4. Student clicks the link.
5. Routed to onboarding step 1.
6. **Step 1 — Identity:** full name, NIM, phone, **year** (dropdown of `cohort_year` enum values).
7. **Step 2 — Skills:** multi-select from the admin-managed `skills` list (searchable). **Can be skipped.** If skipped, the student won't appear in search-based Study Match but can still browse signs and offer help.
8. **Step 3 — Optional:** personal website, profile photo.
9. **Step 4 — Review:** summary + edit links + Finish.
10. On Finish, the profile is saved. Routed to dashboard.

**Validation rules:**

- Username: unique, 3–30 chars, letters/numbers/underscore.
- Email: unique, verifiable.
- NIM: unique, numeric or alphanumeric depending on campus format.
- Phone: normalized to `+62`.
- Year: must be one of the `cohort_year` enum values.
- Skills: 0–20 items, each must reference an existing `skills.id`.
- Personal website: must start with `http://` or `https://` if provided.

### 4.2 Study Match Flow — Search-based (Direction A)

1. Student A opens Study Match.
2. Student A picks one or more **skills** from a typeahead (populated by `skills` table).
3. System returns students where `user_skills` contains at least one of the selected skills.
4. Each result card shows: username, full name, year, matching skills as chips.
5. Student A clicks a result → helper profile view: username, full name, year, skills, **phone number**.
6. Student A clicks "Request help." Modal: subject (pre-filled from selected skill), description, optional preferred time.
7. Submit. **Rate limit check**: max 5 pending outgoing search-based, max 20 outgoing actions today. Blocked with a message if exceeded.
8. A `study_request` is created with `initiated_by = 'requester'`, status `pending`, `expires_at = now() + 7 days`.
9. Student B (helper) sees a count on Study Match page. No push notification.
10. Student B opens the request → accepts or declines.
    - **Accept:** status `accepted`. Both see "Contact via WhatsApp" button (opens `https://wa.me/<phone>` with a pre-filled greeting).
    - **Decline:** status `declined`. Requester sees it in History.
11. If no response in 7 days → status `expired`, soft-deleted, appears in History only.
12. Requester can cancel → status `cancelled`, soft-deleted.

### 4.3 Study Match Flow — Sign-based (Direction B)

**Posting a sign:**

1. Student A clicks "Post a Help Sign."
2. Modal: **skill** (required, from `skills` typeahead), title, description, optional preferred time.
3. Submit. **Rate limit check**: max 3 active signs, max 3 new signs this week. Blocked with message if exceeded.
4. `help_signs` row created with `status = 'open'`, `expires_at = now() + 14 days`.
5. Sign appears on the Help Signs board.

**Browsing and offering help:**

1. Student B opens the Help Signs board tab.
2. Sees open signs. Filters: by skill, "matches my skills" toggle.
3. Signs whose `skill_id` is in Student B's `user_skills` show a "you can help" badge.
4. Student B clicks a sign → full description, poster info (username, full name, year, skills). **Poster's phone is NOT shown.**
5. "Offer help." Modal: short message field.
6. Submit. **Rate limit check**: max 5 pending outgoing offers, max 20 outgoing actions today.
7. `study_request` created with `initiated_by = 'helper'`, `sign_id = the sign`, status `pending`, `expires_at = now() + 7 days`.
8. Poster sees it in the Incoming inbox.

**Responding to an offer:**

1. Poster opens Incoming.
2. Sees the helper's profile and message.
3. Accepts or declines.
   - **Accept:** status `accepted`. Sign becomes `fulfilled`. All other pending offers on the sign auto-decline with status `cancelled`. Both sides get "Contact via WhatsApp".
   - **Decline:** status `declined`. Sign stays open. Helper sees it in History.
4. If no response in 7 days → offer expires (soft-deleted). Sign stays open.

**Closing a sign manually:**

1. Poster opens "My Signs."
2. Clicks "Close sign." Confirmation modal warns pending offers will be auto-declined.
3. Confirm → sign status `closed`, pending offers become `cancelled`.

**Sign expiry:**

- Sign reaches `expires_at` unfulfilled → status `expired`. Pending offers become `cancelled`. Sign removed from board, visible only in My Signs → History.

### 4.4 Competition Match Flow

**Admin side:**

1. Admin logs in → Competition Management.
2. Create competition: title, description, **categories** (multi-select), **image** (upload), **host**, **source URL**, deadline, optional max team size, status (draft/published).
3. Published competitions appear in the public list.
4. Admin can edit, unpublish, or delete any competition (including student-created).

**Student side — creating a competition:**

1. Student clicks "Create competition."
2. Fills in: title, **categories** (multi-select), deadline, short description, **host**, **source URL** (optional), **image** (optional), optional max team size.
3. Published immediately. Creator shown as the student.
4. Admin can later edit or delete it.

**Student side — creating a team:**

1. Student opens a competition detail page.
2. "Create team." Fills in: team name, description, max members (cannot exceed `competition.max_team_size` if set).
3. Student becomes creator and first member. Team is published.

**Student side — joining a team:**

1. Student opens a team page.
2. **Check:** if already in another team for the same competition, "Request to join" is disabled with a message to leave the current team first.
3. Click "Request to join," add a short message, submit.
4. Join request goes to the team creator. Accept or decline.
5. Accept → student becomes a team member.

**Student side — leaving a team:**

1. A member can leave at any time (creator must delete the team or transfer ownership — Section 4.11).
2. Leaving frees the student to join another team for the same competition.

**Team page (public to logged-in users):**

- Team name, description, max members, creation date.
- Creator: username, full name, NIM, phone.
- Each member: username, full name, NIM, phone, personal website (if set).
- Result badge: `unknown`, `won`, `lost`.

**Reporting a result:**

1. After the deadline, any team member (or admin) opens the team page and reports: won / lost / unknown.
2. Stored with `result_reported_at`, `result_reported_by`.
3. If unreported → stays `unknown`.

### 4.5 Timetable Flow

1. Student opens Timetable.
2. Weekly grid shows existing events color-coded by course.
3. **Add event:** course code, title, day, start time, end time, room, **lecturer** (dropdown from `lecturers` table, optional), weekly recurrence toggle. System checks overlap and warns but allows saving.
4. **Import:** choose ICS or JSON (StudentPlanner). Upload → preview parsed events → confirm/cancel. Parse errors shown per row.
5. **Export:** choose ICS or JSON (StudentPlanner, includes lecturer details) → download.
6. **Edit/delete:** click an event block.
7. **Switch semesters:** export current → "Clear semester" → import previous.
8. Week navigation arrows. Recurring events appear every week.

**Conflict rules:**

- Two events conflict if same day and overlapping time ranges.
- Warning shown but saving allowed.
- Imported conflicting events flagged in the preview.

**Lecturer field:**

- Optional. Selected from the admin-managed `lecturers` table.
- Included in JSON export (`lecturer: { name, email, phone, nidn }`).
- On import, if the lecturer email matches an existing lecturer, the link is restored; otherwise a free-text lecturer name is stored as a fallback (`lecturer_name_free_text` column added to handle imports from other systems).

### 4.6 Task Flow

Unchanged from v4:

1. Student opens Tasks.
2. Filter by status (all, pending, done).
3. Add: title, notes, due date, priority. Save.
4. Edit: click task, edit fields, save.
5. Mark complete: click checkbox.
6. Delete: menu → delete → confirm.
7. Sorted by due date, then priority.

### 4.7 Admin Flow

1. Admin logs in → Admin Dashboard with analytics.
2. Navigates to **Skills**: CRUD skills.
3. Navigates to **Categories**: CRUD categories.
4. Navigates to **Lecturers**: CRUD lecturers.
5. Navigates to **Competitions**: list all, edit/delete any.
6. Navigates to **Users**: table with search and filter. View profile (read-only by default). Click "Edit" to modify profile fields. Block/unblock with optional reason. Delete with confirmation.
7. Admin has no timetable, tasks, signs, or teams.

### 4.8 Profile Edit Flow (Student)

1. Student opens Settings → Profile.
2. Can edit: full name, year, skills (via typeahead from `skills`), personal website, profile photo, phone.
3. Cannot edit: username (locked), NIM (locked — admin only after onboarding), email (requires re-verification).
4. Save → changes take effect immediately.
5. Skill changes immediately affect Study Match discovery and sign matching.

### 4.9 Blocked User Flow

1. Admin blocks a student with an optional reason.
2. Student attempts to log in.
3. Login fails with: "Your account has been blocked. Reason: [reason if provided]."
4. Student cannot access any page until unblocked.

### 4.10 Account Deletion Flow (Student)

1. Settings → Account → Delete account.
2. Confirmation modal explains what will be deleted: profile, tasks, timetable, study requests, Help Signs, team memberships, teams created.
3. If the student is the creator of a team with other members: prompted to transfer ownership or delete the team first.
4. Confirm → hard delete with cascade.
5. Study requests and Help Signs involving the deleted user: removed from the other party's active views. Their own history entry remains with the deleted user's name labeled as "Deleted user."

### 4.11 Team Deletion and Creator Deletion

- **Team deletion by creator:** team and memberships removed. Members freed to join another team for the same competition.
- **Team creator deletes account (with other members):** prompted to transfer ownership or delete the team first.
- **Admin deletes a user who created a team:** if the team has other members, ownership transfers to the earliest-joined member. If no other members, the team is deleted.

### 4.12 Rate Limiting

- **Auth:** 5 failed logins per 15 min per IP+email combination.
- **Search-based study requests:** max 5 pending outgoing; max 20 outgoing actions/day (requests + offers combined).
- **Sign-based helper offers:** max 5 pending outgoing; max 20 outgoing actions/day (requests + offers combined).
- **Help Signs:** max 3 active signs per student; max 3 new signs per week.
- **Team join requests:** max 5 pending outgoing.
- **Competition creation by students:** max 3 per week.
- **Skill suggestions (nice-to-have):** max 5 per week.
- Enforced server-side via Nitro middleware + Postgres counters. No external service.

---

## 5. Database Structure

### 5.1 Core Tables

**users**

| Column            | Type                                                 | Notes                                   |
| ----------------- | ---------------------------------------------------- | --------------------------------------- |
| id                | uuid (PK)                                            | Supabase auth user id                   |
| username          | text, unique, not null                               | 3–30 chars                              |
| email             | text, unique, not null                               | Verified via Supabase auth              |
| full_name         | text, not null                                       |                                         |
| nim               | text, unique, not null                               | Editable by admin only after onboarding |
| phone             | text, not null                                       | Normalized to +62                       |
| role              | enum('student','admin'), not null, default 'student' |                                         |
| year              | cohort_year enum, not null                           | See Section 5.4                         |
| personal_website  | text, nullable                                       | Validated URL                           |
| profile_photo_url | text, nullable                                       | Supabase Storage URL                    |
| status            | enum('active','blocked'), not null, default 'active' |                                         |
| blocked_reason    | text, nullable                                       | Shown on login attempt                  |
| last_login_at     | timestamptz, nullable                                | For analytics                           |
| created_at        | timestamptz, default now()                           |                                         |
| updated_at        | timestamptz, default now()                           |                                         |

> **Removed from v4:** `users.skills` array. Replaced by `user_skills` junction.

**skills** — _new in v5_

| Column      | Type                       | Notes                                                            |
| ----------- | -------------------------- | ---------------------------------------------------------------- |
| id          | uuid (PK)                  |                                                                  |
| name        | text, unique, not null     | e.g., "Calculus", "Python", "IF1234 – Algoritma dan Pemrograman" |
| slug        | text, unique, not null     | URL-friendly, e.g., "calculus"                                   |
| description | text, nullable             | Short explanation                                                |
| created_at  | timestamptz, default now() |                                                                  |
| updated_at  | timestamptz, default now() |                                                                  |

**user_skills** — _new in v5_

| Column     | Type                       | Notes |
| ---------- | -------------------------- | ----- |
| id         | uuid (PK)                  |       |
| user_id    | uuid (FK users), not null  |       |
| skill_id   | uuid (FK skills), not null |       |
| created_at | timestamptz, default now() |       |

Unique constraint: `(user_id, skill_id)`.  
Index on `skill_id` for search performance.

**categories** — _new in v5_

| Column      | Type                       | Notes                                                        |
| ----------- | -------------------------- | ------------------------------------------------------------ |
| id          | uuid (PK)                  |                                                              |
| name        | text, unique, not null     | e.g., "Hackathon", "UI/UX", "Data Science"                   |
| slug        | text, unique, not null     |                                                              |
| description | text, nullable             |                                                              |
| color       | text, not null             | Hex color from the design palette, used on the category chip |
| created_at  | timestamptz, default now() |                                                              |
| updated_at  | timestamptz, default now() |                                                              |

**competition_categories** — _new in v5_

| Column         | Type                             | Notes                |
| -------------- | -------------------------------- | -------------------- |
| competition_id | uuid (FK competitions), not null | Part of composite PK |
| category_id    | uuid (FK categories), not null   | Part of composite PK |

Composite PK: `(competition_id, category_id)`.  
A competition can have one or more categories.

**competitions** — _updated in v5_

| Column          | Type                                                | Notes                                           |
| --------------- | --------------------------------------------------- | ----------------------------------------------- |
| id              | uuid (PK)                                           |                                                 |
| title           | text, not null                                      |                                                 |
| description     | text, not null                                      |                                                 |
| deadline        | timestamptz, not null                               |                                                 |
| max_team_size   | int, nullable                                       |                                                 |
| host            | text, not null                                      | e.g., "Universitas Udayana", "HMIF", "Dicoding" |
| source_url      | text, nullable                                      | Validated URL                                   |
| image_url       | text, nullable                                      | Supabase Storage URL                            |
| status          | enum('draft','published','closed'), default 'draft' |                                                 |
| created_by      | uuid (FK users), not null                           | Admin or student                                |
| created_by_role | enum('admin','student'), not null                   | For display                                     |
| created_at      | timestamptz, default now()                          |                                                 |
| updated_at      | timestamptz, default now()                          |                                                 |

> **Removed from v4:** `competitions.category` (single text). Replaced by `competition_categories`.

**lecturers** — _new in v5_

| Column            | Type                       | Notes                                                |
| ----------------- | -------------------------- | ---------------------------------------------------- |
| id                | uuid (PK)                  |                                                      |
| name              | text, not null             |                                                      |
| email             | text, unique, not null     |                                                      |
| phone             | text, nullable             | Normalized to +62 if provided                        |
| profile_photo_url | text, nullable             | "profile" field from the request                     |
| bio               | text, nullable             | Short description (e.g., department, specialization) |
| nidn              | text, unique, nullable     | Indonesian lecturer ID (optional but recommended)    |
| created_at        | timestamptz, default now() |                                                      |
| updated_at        | timestamptz, default now() |                                                      |

**help_signs** — _updated in v5_

| Column         | Type                                                        | Notes                        |
| -------------- | ----------------------------------------------------------- | ---------------------------- |
| id             | uuid (PK)                                                   |                              |
| user_id        | uuid (FK users), not null                                   | Poster                       |
| skill_id       | uuid (FK skills), not null                                  | Required; the matching field |
| title          | text, not null                                              | One-line summary             |
| description    | text, not null                                              | Details                      |
| preferred_time | text, nullable                                              | Free text                    |
| status         | enum('open','fulfilled','closed','expired'), default 'open' |                              |
| created_at     | timestamptz, default now()                                  |                              |
| expires_at     | timestamptz, not null                                       | created_at + 14 days         |
| closed_at      | timestamptz, nullable                                       |                              |

> **Added in v5:** `skill_id` FK (required).

**study_requests** — _unchanged from v4_

| Column         | Type                                                                           | Notes                |
| -------------- | ------------------------------------------------------------------------------ | -------------------- |
| id             | uuid (PK)                                                                      |                      |
| requester_id   | uuid (FK users), not null                                                      |                      |
| helper_id      | uuid (FK users), not null                                                      |                      |
| initiated_by   | enum('requester','helper'), not null, default 'requester'                      |                      |
| sign_id        | uuid (FK help_signs), nullable                                                 |                      |
| subject        | text, not null                                                                 | Skill name or course |
| description    | text, not null                                                                 |                      |
| preferred_time | text, nullable                                                                 |                      |
| status         | enum('pending','accepted','declined','expired','cancelled'), default 'pending' |                      |
| created_at     | timestamptz, default now()                                                     |                      |
| responded_at   | timestamptz, nullable                                                          |                      |
| expires_at     | timestamptz, not null                                                          | created_at + 7 days  |
| deleted_at     | timestamptz, nullable                                                          |                      |

**teams** — _updated in v5_

| Column             | Type                                            | Notes                                            |
| ------------------ | ----------------------------------------------- | ------------------------------------------------ |
| id                 | uuid (PK)                                       |                                                  |
| competition_id     | uuid (FK competitions), not null                |                                                  |
| name               | text, not null                                  |                                                  |
| description        | text, nullable                                  |                                                  |
| max_members        | int, nullable                                   | Cannot exceed `competition.max_team_size` if set |
| creator_id         | uuid (FK users), not null                       |                                                  |
| result             | enum('unknown','won','lost'), default 'unknown' |                                                  |
| result_reported_at | timestamptz, nullable                           |                                                  |
| result_reported_by | uuid (FK users), nullable                       |                                                  |
| created_at         | timestamptz, default now()                      |                                                  |

> **Removed from v4:** `teams.required_roles`.

**team_members** — _updated in v5_

| Column    | Type                                           | Notes                    |
| --------- | ---------------------------------------------- | ------------------------ |
| id        | uuid (PK)                                      |                          |
| team_id   | uuid (FK teams), not null                      |                          |
| user_id   | uuid (FK users), not null                      |                          |
| status    | enum('pending','accepted'), default 'accepted' | Creator is auto-accepted |
| joined_at | timestamptz, default now()                     |                          |

Unique constraint: `(team_id, user_id)`.

> **Removed from v4:** `team_members.role_in_team`.

**timetable_events** — _updated in v5_

| Column                      | Type                                                        | Notes                                                          |
| --------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------- |
| id                          | uuid (PK)                                                   |                                                                |
| user_id                     | uuid (FK users), not null                                   |                                                                |
| course_code                 | text, nullable                                              |                                                                |
| title                       | text, not null                                              |                                                                |
| day_of_week                 | int, not null                                               | 1 = Monday, 7 = Sunday                                         |
| start_time                  | time, not null                                              |                                                                |
| end_time                    | time, not null                                              |                                                                |
| room                        | text, nullable                                              |                                                                |
| **lecturer_id**             | uuid (FK lecturers), nullable                               | _new in v5_                                                    |
| **lecturer_name_free_text** | text, nullable                                              | Fallback for imported events whose lecturer isn't in the table |
| recurrence                  | enum('none','weekly'), default 'weekly'                     |                                                                |
| source                      | enum('manual','ics_import','json_import'), default 'manual' |                                                                |
| created_at                  | timestamptz, default now()                                  |                                                                |

> **Added in v5:** `lecturer_id` FK (nullable), `lecturer_name_free_text`.

**tasks** — _unchanged from v4_

| Column       | Type                                          | Notes |
| ------------ | --------------------------------------------- | ----- |
| id           | uuid (PK)                                     |       |
| user_id      | uuid (FK users), not null                     |       |
| title        | text, not null                                |       |
| notes        | text, nullable                                |       |
| due_date     | date, nullable                                |       |
| priority     | enum('low','medium','high'), default 'medium' |       |
| completed    | boolean, default false                        |       |
| created_at   | timestamptz, default now()                    |       |
| completed_at | timestamptz, nullable                         |       |

### 5.2 Relationships

- users → user_skills (1:N)
- skills → user_skills (1:N)
- users → help_signs (1:N as poster)
- skills → help_signs (1:N)
- users → study_requests (1:N as requester, 1:N as helper)
- help_signs → study_requests (1:N)
- users → competitions (1:N as creator)
- competitions → competition_categories (1:N)
- categories → competition_categories (1:N)
- users → teams (1:N as creator)
- users → team_members (1:N)
- competitions → teams (1:N)
- teams → team_members (1:N)
- users → timetable_events (1:N)
- lecturers → timetable_events (1:N)
- users → tasks (1:N)

### 5.3 StudentPlanner JSON Format (Export/Import) — updated for lecturers

```json
{
  "version": "1.1",
  "source": "unilink",
  "student": {
    "username": "ayu_udayana",
    "nim": "2208561001",
    "year": 2022
  },
  "events": [
    {
      "course_code": "IF1234",
      "title": "Algoritma dan Pemrograman",
      "day_of_week": 1,
      "start_time": "08:00",
      "end_time": "10:30",
      "room": "Lab Komputer 3",
      "recurrence": "weekly",
      "lecturer": {
        "name": "Dr. I Made Sudarma",
        "email": "sudarma@unud.ac.id",
        "phone": "+6281234567890",
        "nidn": "0012345678"
      }
    }
  ]
}
```

**Export:** downloads as `<username>-unilink-timetable.json`. Includes lecturer details when `lecturer_id` is set.

**Import:**

- If `lecturer.email` matches an existing `lecturers.email`, the event links to that lecturer.
- If not, `lecturer.name` is stored in `lecturer_name_free_text` and `lecturer_id` stays NULL.
- If neither is present, both stay NULL.
- Version `1.1` accepts both v1.0 and v1.1 files. If the file has no `lecturer` field, it's treated as v1.0.

### 5.4 Enums and Controlled Vocabularies

**`cohort_year` enum** (Postgres):

```sql
CREATE TYPE cohort_year AS ENUM (
  '2018','2019','2020','2021','2022','2023',
  '2024','2025','2026','2027','2028','2029','2030'
);
```

Notes:

- Fixed set. Adding a new year requires a migration (`ALTER TYPE cohort_year ADD VALUE '2031'`). This is acceptable because the enum changes once per year.
- The team should add a yearly reminder to the roadmap to run this migration. Alternatively, if the admin needs to add years without a migration, this can be converted to a `cohorts` lookup table in a later version.

**Categories** are not an enum — they are admin-managed via the `categories` table. The admin adds, edits, and deletes categories freely.

**Skills** are not an enum — they are admin-managed via the `skills` table. The admin adds, edits, and deletes skills freely.

### 5.5 Optional Tables (Not in MVP)

- `documents` (id, user_id, file_name, file_url, uploaded_at)
- `tasks.todoist_id` column
- `rooms`, `class_schedules`, `korti_status`, `bookings` — only if the Korti pilot is added
- `notifications` (id, user_id, type, payload, read_at) — only if notifications are added
- `skill_suggestions` (id, user_id, suggested_name, status, reviewed_by, reviewed_at) — nice-to-have

---

## 6. Data Visibility Rules

| Data                                        | Who can see it                                                 | Context                                         |
| ------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| Student's username, full name, year, skills | Any logged-in UniLink user                                     | Study Match, Competition Match                  |
| Student's phone number (search-based)       | Any logged-in UniLink user who views the helper's profile      | Study Match, search-based                       |
| Student's phone number (sign-based)         | Only the helper whose offer was accepted, after acceptance     | Sign-based Study Match                          |
| Student's NIM                               | Any logged-in UniLink user who views the Competition team page | Competition Match only                          |
| Student's personal website                  | Any logged-in UniLink user who views the Competition team page | Competition Match only                          |
| Student's email                             | Only the student themselves and Admin                          | Never shown in Study Match or Competition Match |
| Student's tasks                             | Only the student themselves                                    | Private                                         |
| Student's timetable                         | Only the student themselves                                    | Private                                         |
| Help Sign title, description, skill         | All logged-in UniLink users                                    | Help Signs board                                |
| Help Sign poster's phone                    | Only the helper whose offer was accepted                       | Sign-based Study Match                          |
| Study request details                       | Requester and helper only                                      | Private                                         |
| Team details and members                    | All logged-in UniLink users                                    | Public within UniLink                           |
| Team result                                 | All logged-in UniLink users                                    | Public within UniLink                           |
| Skills table                                | All logged-in UniLink users (read); Admin (CRUD)               | Reference data                                  |
| Categories table                            | All logged-in UniLink users (read); Admin (CRUD)               | Reference data                                  |
| Lecturers table                             | All logged-in UniLink users (read); Admin (CRUD)               | Reference data                                  |
| Admin analytics                             | Admin only                                                     | Admin dashboard                                 |

**Key rules:**

- Admin can now **edit** user profile fields: full name, year, phone, skills, personal website, profile photo, NIM (with a warning). Admin cannot change username or email.
- Admin can trigger a password reset email but cannot see or set the password.
- Blocked users cannot log in and see the block reason.
- Deleted users are removed from active views but may appear as "Deleted user" in historical records.

---

## 7. Tech Stack

| Layer                             | Choice                                                                                             | Reason                                                                                                                          |
| --------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**                     | **Nuxt 4** (Vue 3)                                                                                 | Auto-imports, file-based routing, full-stack via Nitro server routes, official Supabase module. **Nuxt 3 is EOL — use Nuxt 4.** |
| **UI**                            | Nuxt UI or Tailwind CSS                                                                            | Rapid prototyping with the UniLink design system tokens.                                                                        |
| **Backend / DB / Auth / Storage** | **Supabase** (Postgres + Auth + Storage)                                                           | Free tier: 500 MB DB, 1 GB storage; RLS for security; easy integration.                                                         |
| **Timetable UI**                  | `nuxt-calendar`                                                                                    | Weekly/day/month views with ICS export/import.                                                                                  |
| **JSON import/export**            | Native JSON parse and stringify                                                                    | No external library.                                                                                                            |
| **Auth**                          | Supabase Auth (email/password + Google OAuth optional)                                             | Email verification built in. SSO optional later.                                                                                |
| **Matching**                      | Supabase queries + Nitro server routes                                                             | Skill search via `user_skills` join; categories via `competition_categories`.                                                   |
| **Phone normalization**           | `libphonenumber-js`                                                                                | Normalize to +62 on save.                                                                                                       |
| **Image upload**                  | Supabase Storage buckets: `profile-photos` (5MB max), `competition-images` (2MB max, JPG/PNG/WebP) | Public buckets for MVP.                                                                                                         |
| **Rate limiting**                 | Nitro server middleware + Postgres counters                                                        | Simple, no external service.                                                                                                    |
| **Version control**               | Git + GitHub                                                                                       | Required by guidebook p.6.                                                                                                      |

### 7.1 Is Vue + Nuxt a Good Choice?

Yes, provided you use **Nuxt 4**. If your team already knows Vue, the learning curve is low. Nuxt's module ecosystem covers auth, Supabase, and calendar needs. The Nitro server routes remove the need for a separate backend. The main risk is accidentally starting on Nuxt 3, which is EOL — pin Nuxt 4 in `package.json`.

If your team is stronger in React, Next.js is also valid. The core matching logic is simple enough that either stack works.

---

## 8. MVP Scope Summary

### Must-Have (Build First)

- **F1 User/Profile** — year from enum, skills from admin-managed table via `user_skills`, phone, personal website, initials fallback avatar
- **F2 Task list**
- **F3 Timetable** — manual entry with lecturer link, ICS import/export, JSON import/export (with lecturer), conflict warning, one semester at a time, clear semester
- **F4 Study Match** — both directions:
  - Search-based: search by managed skill, request, accept/decline, WhatsApp redirect, history, expiry, rate limit
  - Sign-based: post sign for a skill, browse board, "you can help" badge, offer help, accept/decline, sign lifecycle, rate limit
- **F5 Competition Match** — competition with image, categories (multi), host, source URL, deadline, teams with no roles, join/leave rules, public team pages with name/NIM/phone, result reporting
- **F6 Admin** — skills CRUD, categories CRUD, lecturers CRUD, competitions CRUD, users edit + block/unblock + delete, analytics
- **F7 Settings** — profile edit, account delete, logout

### Nice-to-Have (If Time)

- Profile photo upload
- Advanced filters in Study Match (year, "matches my skills" toggle for signs)
- Auto-close competitions when the deadline passes (cron)
- Transfer team ownership when creator leaves
- Skill suggestions from students (admin reviews)
- Simple in-app count badges for pending requests and offers

### Optional Later (Not in MVP)

- Korti role and Room Finder (Section 9)
- Documents storage
- Todoist sync
- In-app messaging
- Notification system
- Real-time SSO
- AI-generated competition listings
- AI-based skill matching
- Converting `cohort_year` to a `cohorts` table if yearly enum migrations become burdensome

### Out of Scope for MVP

- Real-time room availability
- Auto-scraping of campus systems
- In-app chat
- AI problem matching

---

## 9. Optional Later: Korti Role and Room Finder

Unchanged from v4. Not part of the MVP. Documented so the design and database can be extended later without restructuring.

**Korti role:** new role for building/room coordinators. Korti can mark rooms as available/under maintenance for time windows. Admin does not become Korti.

**Room Finder:** students view rooms marked available by Korti and book a time window. Bookings within an available window are auto-approved. Fallback: "likely free" based on static class schedules.

**Pitch framing:** "A pilot with one building. Korti is the trusted source. Auto-approval removes delays."

---

## 10. Scoring Alignment (Guidebook p.9)

| Criteria                        | Weight | How UniLink Addresses It                                                                                                                                                                                                       |
| ------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Innovation Idea**             | 25%    | Two-direction Study Match (search + signs), admin-managed skills/categories/lecturers, competition teams with image/host/source, timetable with lecturer links, and result reporting.                                          |
| **Problem-Solution Fit**        | 15%    | Solves study isolation in both directions; solves team formation; lets students act on competition news before admins do; solves timetable reference data fragmentation (lecturers).                                           |
| **AI / Technology Utilization** | 10%    | Skill-based matching, sign matching, ICS/JSON interop, image upload to Supabase Storage, server-side rate limiting.                                                                                                            |
| **Pitch & Storytelling**        | 25%    | Clear demo: signup → skills → search-based match → WhatsApp → post Help Sign → helper offers → student-created competition (with image, categories, host) → public team page → result report → timetable with lecturer export. |
| **Response to Q&A**             | 10%    | Explainable logic: skill junction, sign lifecycle, two-way requests, team rules, visibility rules, JSON format, rate limits, enum vs. table tradeoffs.                                                                         |
| **Impact & Feasibility**        | 15%    | Very feasible. No live data dependency for core features.                                                                                                                                                                      |

---

## 11. Proposal Outline Mapping (Guidebook p.5)

| Required Section                   | UniLink Content                                                                                                                                                                                                                                                                        |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **a. Cover**                       | Team name, title, division, university logo.                                                                                                                                                                                                                                           |
| **b. Latar Belakang Ide**          | Students struggle to find academic help and competition teammates; peer skills are invisible; competition news reaches students before admins; timetable data (lecturers) is fragmented across apps.                                                                                   |
| **c. Tujuan dan Manfaat**          | Make peer skills discoverable via admin-managed skills; enable two-direction Study Match; make competitions rich (image, categories, host, source) and teams public; centralize timetable with lecturer links; let students create competitions they know about.                       |
| **d. Batasan Perangkat Lunak**     | Web app; external messaging via WhatsApp; no in-app chat; no real-time notifications; one semester at a time; admin-seeded account; two-direction Study Match; sign lifecycle with 14-day expiry; angkatan as enum.                                                                    |
| **e. Metodologi Pengembangan**     | Sprint 1: auth, onboarding, profile. Sprint 2: admin reference data (skills, categories, lecturers). Sprint 3: Study Match — search. Sprint 4: Study Match — signs. Sprint 5: Competition Match. Sprint 6: Timetable + Tasks. Sprint 7: Admin users, analytics, rate limiting, polish. |
| **f. Analisis Kebutuhan & Desain** | Actors (Student, Admin), use-case diagram (two-direction Study Match, admin reference data management), ERD, wireframes, matching rules, sign lifecycle, visibility rules, rate-limit rules, enum-vs-table rationale.                                                                  |
| **g. Implementasi**                | Tech stack (Nuxt 4, Supabase), Git structure, AI prompt log, screenshots.                                                                                                                                                                                                              |
| **h. Dokumentasi Penggunaan**      | Student flow: signup → skills → search or post sign → WhatsApp → competition with categories → team page → result report → timetable with lecturer. Admin flow: login → manage skills/categories/lecturers → edit competition → edit user → view analytics.                            |
| **i. Daftar Pustaka**              | Guidebook, Supabase docs, Nuxt docs, StudentPlanner JSON spec.                                                                                                                                                                                                                         |
| **j. Lampiran (Opsional)**         | Screenshots, test cases, JSON samples, rate-limit config, sign lifecycle state diagram, ERD.                                                                                                                                                                                           |

---

## 12. Resolved Decisions

| #   | Decision                                                                                                                                                                                                                                   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Documents stay optional. Not in MVP.                                                                                                                                                                                                       |
| 2   | Team size limit is variable: `competition.max_team_size` (optional) + `teams.max_members` (must not exceed competition max if set).                                                                                                        |
| 3   | Expired study requests are soft-deleted and visible only in History/Log.                                                                                                                                                                   |
| 4   | A student can be in at most one team per competition. Must leave current team before joining another.                                                                                                                                      |
| 5   | A student can create at most one team per competition.                                                                                                                                                                                     |
| 6   | After the deadline, team members (or admin) can report result: won, lost, or unknown. Unreported = unknown.                                                                                                                                |
| 7   | Students can create competitions. Published immediately. Admin can edit or delete any competition.                                                                                                                                         |
| 8   | Admin account is seeded. Admin email verification optional for MVP.                                                                                                                                                                        |
| 9   | Profile photo optional; initials fallback avatar.                                                                                                                                                                                          |
| 10  | No notification system in MVP. Pending counts shown when the user opens the relevant page.                                                                                                                                                 |
| 11  | Skills are optional on onboarding and editable later.                                                                                                                                                                                      |
| 12  | Timetable supports one semester at a time, with export/import to archive and switch semesters.                                                                                                                                             |
| 13  | SSO is optional later; not in MVP.                                                                                                                                                                                                         |
| 14  | Rate limiting is enforced server-side. Admin can block/delete users; blocked users see a reason on login attempt.                                                                                                                          |
| 15  | Study Match has two directions: search-based and sign-based.                                                                                                                                                                               |
| 16  | Help Sign expires after 14 days unless fulfilled or manually closed.                                                                                                                                                                       |
| 17  | Sign is auto-fulfilled when an offer is accepted. All other pending offers auto-decline with status `cancelled`.                                                                                                                           |
| 18  | Poster's phone is only revealed to the helper after acceptance.                                                                                                                                                                            |
| 19  | Sign offers are rate-limited: max 5 pending offers, max 3 active signs, max 3 new signs per week.                                                                                                                                          |
| 20  | Sign browsing shows a "you can help" badge when the viewer's `user_skills` includes the sign's `skill_id`.                                                                                                                                 |
| 21  | **Skills** are a separate admin-managed table linked via `user_skills`. A user can have multiple skills.                                                                                                                                   |
| 22  | **Year/angkatan** is a Postgres enum (`cohort_year`), not a free integer.                                                                                                                                                                  |
| 23  | **Categories** are a separate admin-managed table linked via `competition_categories` (many-to-many). A competition can have one or more categories.                                                                                       |
| 24  | **Competitions** now carry an **image** (`image_url`), a **source URL** (`source_url`), and a **host** (`host`).                                                                                                                           |
| 25  | **Teams** have no roles. `teams.required_roles` and `team_members.role_in_team` are removed.                                                                                                                                               |
| 26  | **Lecturers** are an admin-managed table (`lecturers`). `timetable_events.lecturer_id` is an optional FK. Imports from other systems can use `lecturer_name_free_text` as a fallback.                                                      |
| 27  | **Admin** can now fully manage: skills (CRUD), categories (CRUD), lecturers (CRUD), competitions (CRUD), users (edit profile fields, block/unblock, delete). Admin cannot change a user's username or email, and cannot see/set passwords. |

---

## 13. Remaining Gaps (Handled by the Team)

| #   | Gap                            | Current decision                                                                                           |
| --- | ------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| 1   | Mobile experience              | Responsive web required. Native app out of scope.                                                          |
| 2   | Data deletion                  | Students can delete their own account with confirmation and cascade. Admin can delete any user.            |
| 3   | `cohort_year` enum maintenance | Requires a yearly migration to add new years. Team adds a roadmap note.                                    |
| 4   | Seeded reference data          | Admin seed + initial skills + categories + sample lecturers should be committed as migrations.             |
| 5   | StudentPlanner format          | Section 5.3 is a proposal (v1.1). Confirm with the actual app's schema; the version field handles changes. |
| 6   | Password reset by admin        | Admin can trigger a reset email but cannot see or set the password.                                        |

---

## 14. UI Implications (for the design prompt)

Summary of design surface changes driven by v5. Feed these into the design prompt when updating the Figma or Google Stitch brief.

| Screen                         | What changed                                                                                                                                                                                                                                                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Onboarding Step 1              | Year is now a **dropdown** of enum values (2018–2030), not a free number input.                                                                                                                                                                                                                                                 |
| Onboarding Step 2              | Skills are a **searchable multi-select** from the admin-managed list. No free-text field.                                                                                                                                                                                                                                       |
| Study Match — search           | Search input is a **skill typeahead** that resolves to `skill_id`, not a free-text field.                                                                                                                                                                                                                                       |
| Study Match — helper profile   | Skills render as chips from `skills.name`.                                                                                                                                                                                                                                                                                      |
| Study Match — Help Sign modal  | A **skill selector** (required) is now part of the sign form.                                                                                                                                                                                                                                                                   |
| Help Signs board               | Cards show the sign's skill chip and a "you can help" badge when the viewer's skills include it. Filter bar gains a **skill filter** and a **"matches my skills" toggle**.                                                                                                                                                      |
| Competition — create/edit form | New fields: **image upload**, **categories multi-select**, **host**, **source URL**.                                                                                                                                                                                                                                            |
| Competition — card             | Shows **image thumbnail**, **category chips**, **host**, **source URL** (as a small "Official page" link).                                                                                                                                                                                                                      |
| Competition — detail           | Same as above plus a "Visit official page" link.                                                                                                                                                                                                                                                                                |
| Team — create form             | **No role fields.** Just name, description, max members.                                                                                                                                                                                                                                                                        |
| Team page                      | Members render as a simple list without role labels.                                                                                                                                                                                                                                                                            |
| Timetable — add/edit event     | **Lecturer dropdown** (optional) populated from the admin-managed `lecturers` table.                                                                                                                                                                                                                                            |
| Timetable — import preview     | Shows lecturer column when present in the imported file.                                                                                                                                                                                                                                                                        |
| Timetable — export             | ICS and JSON both include lecturer details (JSON v1.1).                                                                                                                                                                                                                                                                         |
| Admin — new pages              | **Skills** (list + create/edit/delete modal), **Categories** (list + create/edit/delete modal with color picker), **Lecturers** (list + create/edit/delete modal), **Users** (edit modal with all profile fields except username/email), **Competitions** (already had; now shows image, categories, host, source URL columns). |
| Admin — dashboard              | New stat cards: Total skills, Total categories, Total lecturers. Competition stat now shows per-category breakdown.                                                                                                                                                                                                             |
| Data visibility                | No UI change; the rules in Section 6 already reflect v5.                                                                                                                                                                                                                                                                        |

Also update the **anti-slop / anti-brutalist audit** in the design prompt: no change in visual rules, but the **screens list** and **empty state illustrations** should now reflect the richer reference data (e.g., category chips are colorful, competition cards show images).

---

## 15. Next Steps

1. **Finalize team roles** (Hacker, Hipster, Hustler) per guidebook p.4.
2. **Set up GitHub repository** with README, branch strategy, commit conventions (p.6).
3. **Initialize Nuxt 4 + Supabase**; configure auth, RLS, storage buckets (`profile-photos`, `competition-images`).
4. **Seed data migration:**
   - First admin account.
   - Initial skills list (from the Informatics curriculum).
   - Initial categories (Hackathon, UI/UX, Data Science, CTF, Robotics, Business Plan, etc., each with a color from the palette).
   - Sample lecturers (or leave empty for the pilot).
5. **Build Sprint 1:** Auth, onboarding (steps 1–4 with enum year and skill junction), profile edit.
6. **Build Sprint 2:** Admin reference data (skills CRUD, categories CRUD, lecturers CRUD).
7. **Build Sprint 3:** Study Match — search-based.
8. **Build Sprint 4:** Study Match — sign-based.
9. **Build Sprint 5:** Competition Match (rich competition fields, teams without roles, public team page, result reporting).
10. **Build Sprint 6:** Timetable (with lecturer link) + Tasks.
11. **Build Sprint 7:** Admin users edit, analytics, rate limiting across all features, polish, empty states, error states.
12. **Write proposal** using the outline in Section 11.
13. **Prepare pitch deck** and demo script (p.6).
14. **Submit** by 20 November 2026 (p.8).

---

_End of Document_
