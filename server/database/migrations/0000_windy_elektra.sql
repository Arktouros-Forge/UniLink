CREATE TYPE "public"."cohort_year" AS ENUM('2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030');--> statement-breakpoint
CREATE TYPE "public"."competition_creator_role" AS ENUM('admin', 'student');--> statement-breakpoint
CREATE TYPE "public"."competition_status" AS ENUM('draft', 'published', 'closed');--> statement-breakpoint
CREATE TYPE "public"."help_sign_status" AS ENUM('open', 'fulfilled', 'closed', 'expired');--> statement-breakpoint
CREATE TYPE "public"."study_request_initiator" AS ENUM('requester', 'helper');--> statement-breakpoint
CREATE TYPE "public"."study_request_status" AS ENUM('pending', 'accepted', 'declined', 'expired', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."task_priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."team_member_status" AS ENUM('pending', 'accepted');--> statement-breakpoint
CREATE TYPE "public"."team_result" AS ENUM('unknown', 'won', 'lost');--> statement-breakpoint
CREATE TYPE "public"."timetable_recurrence" AS ENUM('none', 'weekly');--> statement-breakpoint
CREATE TYPE "public"."timetable_source" AS ENUM('manual', 'ics_import', 'json_import');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('student', 'admin');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'blocked');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"color" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "competition_categories" (
	"competition_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "competition_categories_competition_id_category_id_pk" PRIMARY KEY("competition_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "competitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"deadline" timestamp with time zone NOT NULL,
	"max_team_size" integer,
	"host" text NOT NULL,
	"source_url" text,
	"image_url" text,
	"status" "competition_status" DEFAULT 'draft' NOT NULL,
	"created_by" uuid NOT NULL,
	"created_by_role" "competition_creator_role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "help_signs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"preferred_time" text,
	"status" "help_sign_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"closed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "lecturers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"profile_photo_url" text,
	"bio" text,
	"nidn" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lecturers_email_unique" UNIQUE("email"),
	CONSTRAINT "lecturers_nidn_unique" UNIQUE("nidn")
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skills_name_unique" UNIQUE("name"),
	CONSTRAINT "skills_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "study_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requester_id" uuid NOT NULL,
	"helper_id" uuid NOT NULL,
	"initiated_by" "study_request_initiator" DEFAULT 'requester' NOT NULL,
	"sign_id" uuid,
	"subject" text NOT NULL,
	"description" text NOT NULL,
	"preferred_time" text,
	"status" "study_request_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"responded_at" timestamp with time zone,
	"expires_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"notes" text,
	"due_date" date,
	"priority" "task_priority" DEFAULT 'medium' NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "team_member_status" DEFAULT 'accepted' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"competition_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"max_members" integer,
	"creator_id" uuid NOT NULL,
	"result" "team_result" DEFAULT 'unknown' NOT NULL,
	"result_reported_at" timestamp with time zone,
	"result_reported_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "timetable_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"course_code" text,
	"title" text NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"room" text,
	"lecturer_id" uuid,
	"lecturer_name_free_text" text,
	"recurrence" timetable_recurrence DEFAULT 'weekly' NOT NULL,
	"source" timetable_source DEFAULT 'manual' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"nim" text NOT NULL,
	"phone" text NOT NULL,
	"role" "user_role" DEFAULT 'student' NOT NULL,
	"year" "cohort_year" NOT NULL,
	"personal_website" text,
	"profile_photo_url" text,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"blocked_reason" text,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_nim_unique" UNIQUE("nim")
);
--> statement-breakpoint
ALTER TABLE "competition_categories" ADD CONSTRAINT "competition_categories_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competition_categories" ADD CONSTRAINT "competition_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitions" ADD CONSTRAINT "competitions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "help_signs" ADD CONSTRAINT "help_signs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "help_signs" ADD CONSTRAINT "help_signs_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_requests" ADD CONSTRAINT "study_requests_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_requests" ADD CONSTRAINT "study_requests_helper_id_users_id_fk" FOREIGN KEY ("helper_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_requests" ADD CONSTRAINT "study_requests_sign_id_help_signs_id_fk" FOREIGN KEY ("sign_id") REFERENCES "public"."help_signs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_result_reported_by_users_id_fk" FOREIGN KEY ("result_reported_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timetable_events" ADD CONSTRAINT "timetable_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timetable_events" ADD CONSTRAINT "timetable_events_lecturer_id_lecturers_id_fk" FOREIGN KEY ("lecturer_id") REFERENCES "public"."lecturers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "help_signs_skill_id_idx" ON "help_signs" USING btree ("skill_id");--> statement-breakpoint
CREATE INDEX "help_signs_user_id_idx" ON "help_signs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "help_signs_status_idx" ON "help_signs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "study_requests_requester_id_idx" ON "study_requests" USING btree ("requester_id");--> statement-breakpoint
CREATE INDEX "study_requests_helper_id_idx" ON "study_requests" USING btree ("helper_id");--> statement-breakpoint
CREATE INDEX "study_requests_sign_id_idx" ON "study_requests" USING btree ("sign_id");--> statement-breakpoint
CREATE INDEX "study_requests_status_idx" ON "study_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tasks_user_id_idx" ON "tasks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tasks_due_date_idx" ON "tasks" USING btree ("due_date");--> statement-breakpoint
CREATE UNIQUE INDEX "team_members_team_user_unique" ON "team_members" USING btree ("team_id","user_id");--> statement-breakpoint
CREATE INDEX "team_members_user_id_idx" ON "team_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "teams_competition_id_idx" ON "teams" USING btree ("competition_id");--> statement-breakpoint
CREATE UNIQUE INDEX "teams_competition_creator_unique" ON "teams" USING btree ("competition_id","creator_id");--> statement-breakpoint
CREATE INDEX "timetable_events_user_id_idx" ON "timetable_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "timetable_events_lecturer_id_idx" ON "timetable_events" USING btree ("lecturer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_skills_user_skill_unique" ON "user_skills" USING btree ("user_id","skill_id");--> statement-breakpoint
CREATE INDEX "user_skills_skill_id_idx" ON "user_skills" USING btree ("skill_id");
