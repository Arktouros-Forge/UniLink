import { sql } from "drizzle-orm";

import { db } from "@database/index";

const rows = async (query) => [...(await db.execute(query))];

export async function getStudentDashboard(userId) {
  const [[counts], pending, teamsActive, tasksDue, activity] =
    await Promise.all([
      db.execute(sql`
      select
        (select count(*)::int from study_requests r where r.deleted_at is null and r.status = 'pending' and r.expires_at > now()
          and ((r.initiated_by = 'requester' and r.helper_id = ${userId}) or (r.initiated_by = 'helper' and r.requester_id = ${userId}))) as "pendingRequests",
        (select count(*)::int from team_members m join teams t on t.id = m.team_id join competitions c on c.id = t.competition_id
          where m.user_id = ${userId} and m.status = 'accepted' and c.status <> 'closed') as "activeTeams",
        (select count(*)::int from tasks where user_id = ${userId} and not completed) as "openTasks",
        (select count(*)::int from tasks where user_id = ${userId} and not completed and due_date < current_date) as "overdueTasks",
        (select count(*)::int from tasks where user_id = ${userId} and completed and completed_at > now() - interval '7 days') as "doneThisWeek",
        (select count(*)::int from study_requests r where r.helper_id = ${userId} and r.status = 'accepted' and r.deleted_at is null) as helped
    `),
      rows(sql`
      select r.id, r.subject, r.created_at as "createdAt",
        json_build_object('id', u.id, 'fullName', u.full_name, 'profilePhotoUrl', u.profile_photo_url) as sender
      from study_requests r
      join users u on u.id = case when r.initiated_by = 'requester' then r.requester_id else r.helper_id end
      where r.deleted_at is null and r.status = 'pending' and r.expires_at > now()
        and ((r.initiated_by = 'requester' and r.helper_id = ${userId}) or (r.initiated_by = 'helper' and r.requester_id = ${userId}))
      order by r.created_at desc limit 3
    `),
      rows(sql`
      select t.id, t.name, c.title as "competitionTitle", c.deadline as "competitionDeadline",
        (select count(*) from team_members x where x.team_id = t.id and x.status = 'accepted')::int as "memberCount",
        coalesce(t.max_members, c.max_team_size) as "capacity",
        (select count(*) from team_members x where x.team_id = t.id and x.status = 'pending' and t.creator_id = ${userId})::int as "pendingJoin"
      from team_members m join teams t on t.id = m.team_id join competitions c on c.id = t.competition_id
      where m.user_id = ${userId} and m.status = 'accepted' and c.status <> 'closed'
      order by c.deadline asc limit 3
    `),
      rows(sql`
      select id, title, course, priority, due_date as "dueDate" from tasks
      where user_id = ${userId} and not completed order by due_date asc nulls last, priority desc limit 5
    `),
      rows(sql`
      (select 'request-accepted' as type, r.subject as label, r.responded_at as at from study_requests r
        where r.deleted_at is null and r.status = 'accepted' and (r.requester_id = ${userId} or r.helper_id = ${userId}) and r.responded_at is not null)
      union all
      (select 'team-joined', t.name, m.joined_at from team_members m join teams t on t.id = m.team_id where m.user_id = ${userId} and m.status = 'accepted')
      union all
      (select 'task-done', k.title, k.completed_at from tasks k where k.user_id = ${userId} and k.completed and k.completed_at is not null)
      order by at desc limit 5
    `),
    ]);

  return {
    counts,
    pendingRequests: pending,
    teams: teamsActive,
    tasks: tasksDue,
    activity,
  };
}

export async function getAdminDashboard() {
  const [
    [totals],
    signups,
    byYear,
    byCategory,
    requestStatus,
    topSkills,
    recentUsers,
  ] = await Promise.all([
    db.execute(sql`
      select
        (select count(*)::int from users where role = 'student') as students,
        (select count(*)::int from users where role = 'student' and status = 'blocked') as blocked,
        (select count(*)::int from users where role = 'student' and last_login_at > now() - interval '7 days') as "activeWeek",
        (select count(*)::int from competitions where status = 'published' and deadline > now()) as "openCompetitions",
        (select count(*)::int from competitions) as competitions,
        (select count(*)::int from teams) as teams,
        (select count(*)::int from study_requests where deleted_at is null) as requests,
        (select count(*)::int from study_requests where deleted_at is null and status = 'accepted') as "acceptedRequests",
        (select count(*)::int from help_signs where status = 'open' and expires_at > now()) as "openSigns",
        (select count(*)::int from skills) as skills
    `),
    rows(sql`
      select to_char(m, 'YYYY-MM') as month, count(u.id)::int as count
      from generate_series(date_trunc('month', now()) - interval '5 months', date_trunc('month', now()), interval '1 month') m
      left join users u on date_trunc('month', u.created_at) = m and u.role = 'student'
      group by m order by m
    `),
    rows(
      sql`select year::text as year, count(*)::int as count from users where role = 'student' group by year order by year`,
    ),
    rows(sql`
      select c.name, c.color, count(cc.competition_id)::int as count
      from categories c left join competition_categories cc on cc.category_id = c.id
      group by c.id order by count desc, c.name
    `),
    rows(
      sql`select status::text as status, count(*)::int as count from study_requests where deleted_at is null group by status order by count desc`,
    ),
    rows(sql`
      select s.name, count(us.user_id)::int as count
      from skills s left join user_skills us on us.skill_id = s.id
      group by s.id order by count desc, s.name limit 8
    `),
    rows(
      sql`select id, full_name as "fullName", year, major, status, created_at as "createdAt" from users where role = 'student' order by created_at desc limit 5`,
    ),
  ]);

  return {
    totals,
    signups,
    byYear,
    byCategory,
    requestStatus,
    topSkills,
    recentUsers,
  };
}
