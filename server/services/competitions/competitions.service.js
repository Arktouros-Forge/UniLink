import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  inArray,
  or,
  sql,
} from "drizzle-orm";

import { db } from "@database/index";
import {
  categories,
  competitionCategories,
  competitions,
  teamMembers,
  teams,
  users,
} from "@database/schema/index";

import { fail } from "../../utils/errors.js";
import { likePattern } from "../../utils/pagination.js";
import { competitionCategoriesJson, finishPage, ref, totalOver } from "../_sql.js";

const listColumns = () => {
  const { description, ...rest } = getTableColumns(competitions);
  return {
    ...rest,
    summary: sql`left(${description}, 180)`,
    categories: competitionCategoriesJson(competitions.id),
    teamCount:
      sql`(select count(*) from teams t where t.competition_id = ${ref(competitions.id)})`.mapWith(
        Number,
      ),
  };
};

const visibleTo = (viewer) =>
  viewer.role === "admin"
    ? undefined
    : or(
        inArray(competitions.status, ["published", "closed"]),
        eq(competitions.createdBy, viewer.id),
      );

const withState = (row) => {
  const deadline = new Date(row.deadline).getTime();
  const msLeft = deadline - Date.now();
  return {
    ...row,
    isOpen: row.status === "published" && msLeft > 0,
    daysLeft: msLeft > 0 ? Math.ceil(msLeft / 86_400_000) : 0,
  };
};

export async function listCompetitions(
  viewer,
  { q, categoryId, state, sort, mine, status, page, limit },
) {
  const conditions = [visibleTo(viewer)];

  if (q) {
    const pattern = likePattern(q);
    conditions.push(
      or(
        ilike(competitions.title, pattern),
        ilike(competitions.host, pattern),
        ilike(competitions.description, pattern),
      ),
    );
  }
  if (categoryId) {
    conditions.push(
      sql`exists (select 1 from competition_categories cc where cc.competition_id = ${ref(competitions.id)} and cc.category_id = ${categoryId})`,
    );
  }
  if (state === "open")
    conditions.push(
      and(
        eq(competitions.status, "published"),
        sql`${competitions.deadline} > now()`,
      ),
    );
  if (state === "closed")
    conditions.push(
      or(
        eq(competitions.status, "closed"),
        sql`${competitions.deadline} <= now()`,
      ),
    );
  if (status) conditions.push(eq(competitions.status, status));
  if (mine) conditions.push(eq(competitions.createdBy, viewer.id));

  const where = and(...conditions);
  const order = {
    deadline: [asc(competitions.deadline)],
    newest: [desc(competitions.createdAt)],
    popular: [
      desc(
        sql`(select count(*) from teams t where t.competition_id = ${ref(competitions.id)})`,
      ),
      asc(competitions.deadline),
    ],
  }[sort];

  const rows = await db
    .select({ ...listColumns(), total: totalOver() })
    .from(competitions)
    .where(where)
    .orderBy(...order)
    .limit(limit)
    .offset((page - 1) * limit);

  const result = await finishPage(
    rows,
    { page, limit },
    async () =>
      (await db.select({ n: count() }).from(competitions).where(where))[0].n,
  );
  return {
    competitions: result.items.map(withState),
    pagination: result.pagination,
  };
}

export async function getCompetition(viewer, id) {
  const [competition] = await db
    .select({
      ...getTableColumns(competitions),
      categories: competitionCategoriesJson(competitions.id),
      creator: sql`(select json_build_object('id', u.id, 'fullName', u.full_name, 'role', u.role) from users u where u.id = ${ref(competitions.createdBy)})`,
    })
    .from(competitions)
    .where(and(eq(competitions.id, id), visibleTo(viewer)))
    .limit(1);

  if (!competition) fail("COMPETITION_NOT_FOUND");

  const teamRows = await db
    .select({
      id: teams.id,
      name: teams.name,
      description: teams.description,
      maxMembers: teams.maxMembers,
      result: teams.result,
      creatorId: teams.creatorId,
      creatorName: users.fullName,
      acceptedCount:
        sql`(select count(*) from team_members m where m.team_id = ${teams.id} and m.status = 'accepted')`.mapWith(
          Number,
        ),
      members: sql`coalesce((
        select json_agg(json_build_object('id', mu.id, 'fullName', mu.full_name, 'profilePhotoUrl', mu.profile_photo_url) order by m.joined_at)
        from team_members m join users mu on mu.id = m.user_id
        where m.team_id = ${teams.id} and m.status = 'accepted'
      ), '[]'::json)`,
      myStatus: sql`(select m.status from team_members m where m.team_id = ${teams.id} and m.user_id = ${viewer.id})`,
    })
    .from(teams)
    .innerJoin(users, eq(users.id, teams.creatorId))
    .where(eq(teams.competitionId, id))
    .orderBy(desc(teams.createdAt));

  const mine = teamRows.find((team) => team.myStatus);

  return {
    ...withState(competition),
    teams: teamRows.map((team) => ({
      ...team,
      isFull:
        (team.maxMembers ?? competition.maxTeamSize) !== null &&
        team.acceptedCount >= (team.maxMembers ?? competition.maxTeamSize),
    })),
    myTeamId: mine?.myStatus === "accepted" ? mine.id : null,
    myPendingTeamId: mine?.myStatus === "pending" ? mine.id : null,
    canEdit: viewer.role === "admin" || competition.createdBy === viewer.id,
  };
}

async function assertCategories(tx, categoryIds) {
  const unique = [...new Set(categoryIds)];
  const found = await tx
    .select({ id: categories.id })
    .from(categories)
    .where(inArray(categories.id, unique));
  if (found.length !== unique.length) fail("CATEGORY_NOT_FOUND");
  return unique;
}

const clean = (data) => ({
  ...data,
  ...(data.title !== undefined && { title: data.title.trim() }),
  ...(data.host !== undefined && { host: data.host.trim() }),
});

export async function createCompetition(viewer, { categoryIds, ...data }) {
  return db
    .transaction(async (tx) => {
      const unique = await assertCategories(tx, categoryIds);
      const isAdmin = viewer.role === "admin";

      const [row] = await tx
        .insert(competitions)
        .values({
          ...clean(data),
          status: isAdmin ? (data.status ?? "published") : "published",
          createdBy: viewer.id,
          createdByRole: viewer.role,
        })
        .returning({ id: competitions.id });

      await tx
        .insert(competitionCategories)
        .values(
          unique.map((categoryId) => ({ competitionId: row.id, categoryId })),
        );
      return row.id;
    })
    .then((id) => getCompetition(viewer, id));
}

export async function updateCompetition(viewer, id, { categoryIds, ...data }) {
  await db.transaction(async (tx) => {
    const [current] = await tx
      .select({
        createdBy: competitions.createdBy,
        status: competitions.status,
      })
      .from(competitions)
      .where(eq(competitions.id, id))
      .for("update");

    if (!current) fail("COMPETITION_NOT_FOUND");
    if (viewer.role !== "admin") {
      if (current.createdBy !== viewer.id) fail("FORBIDDEN");
      if (current.status === "closed") fail("COMPETITION_CLOSED");
      delete data.status;
    }

    if (Object.keys(data).length)
      await tx
        .update(competitions)
        .set(clean(data))
        .where(eq(competitions.id, id));

    if (categoryIds) {
      const unique = await assertCategories(tx, categoryIds);
      await tx
        .delete(competitionCategories)
        .where(eq(competitionCategories.competitionId, id));
      await tx
        .insert(competitionCategories)
        .values(
          unique.map((categoryId) => ({ competitionId: id, categoryId })),
        );
    }
  });

  return getCompetition(viewer, id);
}

export async function deleteCompetition(viewer, id) {
  const [current] = await db
    .select({ createdBy: competitions.createdBy })
    .from(competitions)
    .where(eq(competitions.id, id))
    .limit(1);
  if (!current) fail("COMPETITION_NOT_FOUND");
  if (viewer.role !== "admin" && current.createdBy !== viewer.id)
    fail("FORBIDDEN");

  if (viewer.role !== "admin") {
    const [{ n }] = await db
      .select({ n: count() })
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.competitionId, id),
          sql`${teamMembers.userId} <> ${viewer.id}`,
        ),
      );
    if (n > 0)
      fail("IN_USE", [
        {
          field: "teams",
          message: "Other students already joined teams for this competition",
        },
      ]);
  }

  await db.delete(competitions).where(eq(competitions.id, id));
  return { id };
}
