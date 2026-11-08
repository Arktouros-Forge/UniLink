import { getTableName, sql } from "drizzle-orm";

import { pageMeta } from "../utils/pagination.js";

export const ref = (column) => sql.raw(`"${getTableName(column.table)}"."${column.name}"`);

export const userSkillsJson = (userIdColumn) => sql`coalesce((
  select json_agg(json_build_object('id', s.id, 'name', s.name, 'slug', s.slug) order by s.name)
  from user_skills us join skills s on s.id = us.skill_id
  where us.user_id = ${ref(userIdColumn)}
), '[]'::json)`;

export const competitionCategoriesJson = (competitionIdColumn) => sql`coalesce((
  select json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'color', c.color) order by c.name)
  from competition_categories cc join categories c on c.id = cc.category_id
  where cc.competition_id = ${ref(competitionIdColumn)}
), '[]'::json)`;

export const totalOver = () => sql`count(*) over()`.mapWith(Number);

export async function finishPage(rows, { page, limit }, countFallback) {
  let total = rows[0]?.total;
  if (total === undefined)
    total = page > 1 && countFallback ? await countFallback() : 0;
  return {
    items: rows.map(({ total: _total, ...row }) => row),
    pagination: pageMeta(page, limit, total),
  };
}

export const pick = (source, keys) =>
  Object.fromEntries(
    keys
      .filter((key) => source[key] !== undefined)
      .map((key) => [key, source[key]]),
  );

export const whatsappUrl = (phone, text) =>
  !phone ? null : `https://wa.me/${phone.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
