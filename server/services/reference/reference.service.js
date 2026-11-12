import { asc, count, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";

import { db } from "@database/index";
import { categories, skills } from "@database/schema/index";

import { fail } from "../../utils/errors.js";
import { likePattern } from "../../utils/pagination.js";
import { slugify } from "../../utils/slug.js";
import { createTtlCache } from "../../utils/ttl-cache.js";
import { finishPage, ref, totalOver } from "../_sql.js";

const lists = createTtlCache({ ttl: 60_000, max: 20 });

function createReference({ key, table, search, usage, slugged }) {
  const usageSql = sql`${usage}`.mapWith(Number);

  const normalize = (data) =>
    slugged && data.name ? { ...data, slug: slugify(data.name) } : data;

  return {
    key,

    async all(columns) {
      return lists.remember(key, () =>
        db.select(columns).from(table).orderBy(asc(table.name)),
      );
    },

    async page({ q, page, limit }) {
      const where = q
        ? or(...search.map((column) => ilike(column, likePattern(q))))
        : undefined;
      const rows = await db
        .select({
          ...getTableColumns(table),
          usage: usageSql,
          total: totalOver(),
        })
        .from(table)
        .where(where)
        .orderBy(asc(table.name))
        .limit(limit)
        .offset((page - 1) * limit);
      return finishPage(
        rows,
        { page, limit },
        async () =>
          (await db.select({ n: count() }).from(table).where(where))[0].n,
      );
    },

    async get(id) {
      const [row] = await db
        .select({ ...getTableColumns(table), usage: usageSql })
        .from(table)
        .where(eq(table.id, id))
        .limit(1);
      if (!row) fail("NOT_FOUND");
      return row;
    },

    async create(data) {
      const [row] = await db.insert(table).values(normalize(data)).returning();
      lists.clear();
      return row;
    },

    async update(id, data) {
      const [row] = await db
        .update(table)
        .set(normalize(data))
        .where(eq(table.id, id))
        .returning();
      if (!row) fail("NOT_FOUND");
      lists.clear();
      return row;
    },

    async remove(id, force = false) {
      const current = await this.get(id);
      if (current.usage > 0 && !force)
        fail("IN_USE", [
          {
            field: "usage",
            message: `Used by ${current.usage} record(s). Pass force=true to delete anyway.`,
          },
        ]);
      await db.delete(table).where(eq(table.id, id));
      lists.clear();
      return { id };
    },
  };
}

export const skillRef = createReference({
  key: "skills",
  table: skills,
  search: [skills.name, skills.description],
  slugged: true,
  usage: sql`(select count(*) from user_skills us where us.skill_id = ${ref(skills.id)}) + (select count(*) from help_signs h where h.skill_id = ${ref(skills.id)})`,
});

export const categoryRef = createReference({
  key: "categories",
  table: categories,
  search: [categories.name, categories.description],
  slugged: true,
  usage: sql`(select count(*) from competition_categories cc where cc.category_id = ${ref(categories.id)})`,
});

export const listSkills = () =>
  skillRef.all({
    id: skills.id,
    name: skills.name,
    slug: skills.slug,
    description: skills.description,
  });

export const listCategories = () =>
  categoryRef.all({
    id: categories.id,
    name: categories.name,
    slug: categories.slug,
    description: categories.description,
    color: categories.color,
  });

export async function getSkillWithHolders(id) {
  const skill = await skillRef.get(id);
  const holders = await db.execute(sql`
    select u.id, u.full_name as "fullName", u.username, u.year, u.major, u.profile_photo_url as "profilePhotoUrl"
    from user_skills us join users u on u.id = us.user_id
    where us.skill_id = ${id} and u.status = 'active' and u.role = 'student'
    order by u.full_name limit 12
  `);
  return { ...skill, holders: [...holders] };
}
