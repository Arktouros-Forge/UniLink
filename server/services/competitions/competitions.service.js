import { and, asc, count, eq, ilike, inArray, or } from "drizzle-orm";

import { db } from "@database/index";
import { competitions, competitionCategories } from "@database/schema/index";
import { categories } from "@database/schema/index";

import { sql } from "drizzle-orm";

export async function getCompetitions({ userId, q, categoryId, page, limit }) {
  const conditions = [
    or(
      inArray(competitions.status, ["published", "closed"]),
      eq(competitions.createdBy, userId),
    ),
  ];

  if (q) {
    conditions.push(
      or(
        ilike(competitions.title, `%${q}%`),
        ilike(competitions.description, `%${q}%`),
        ilike(competitions.host, `%${q}%`),
      ),
    );
  }

  if (categoryId) {
    const matchingIds = db
      .select({ competitionId: competitionCategories.competitionId })
      .from(competitionCategories)
      .where(eq(competitionCategories.categoryId, categoryId));

    conditions.push(inArray(competitions.id, matchingIds));
  }

  const where = and(...conditions);
  const offset = (page - 1) * limit;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: competitions.id,
        title: competitions.title,
        description: competitions.description,
        maxTeamSize: competitions.maxTeamSize,
        sourceUrl: competitions.sourceUrl,
        imageUrl: competitions.imageUrl,
        status: competitions.status,
        createdAt: competitions.createdAt,
      })
      .from(competitions)
      .where(where)
      .orderBy(asc(competitions.deadline))
      .limit(limit)
      .offset(offset),

    db.select({ total: count() }).from(competitions).where(where),
  ]);

  const competitionIds = rows.map((row) => row.id);

  const categoryRows = competitionIds.length
    ? await db
        .select({
          competitionId: competitionCategories.competitionId,
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          color: categories.color,
        })
        .from(competitionCategories)
        .innerJoin(
          categories,
          eq(competitionCategories.categoryId, categories.id),
        )
        .where(inArray(competitionCategories.competitionId, competitionIds))
    : [];

  const categoryMap = new Map();

  for (const category of categoryRows) {
    const current = categoryMap.get(category.competitionId) ?? [];

    current.push({
      id: category.id,
      name: category.name,
      slug: category.slug,
      color: category.color,
    });

    categoryMap.set(category.competitionId, current);
  }

  return {
    competitions: rows.map((row) => ({
      ...row,
      categories: categoryMap.get(row.id) ?? [],
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getCompetitionById(competitionId, userId) {
  const [competition] = await db
    .select({
      id: competitions.id,
      title: competitions.title,
      description: competitions.description,
      deadline: competitions.deadline,
      maxTeamSize: competitions.maxTeamSize,
      host: competitions.host,
      sourceUrl: competitions.sourceUrl,
      imageUrl: competitions.imageUrl,
      status: competitions.status,
      createdBy: competitions.createdBy,
      createdByRole: competitions.createdByRole,
      createdAt: competitions.createdAt,
      updatedAt: competitions.updatedAt,
    })
    .from(competitions)
    .where(
      and(
        eq(competitions.id, competitionId),
        or(
          inArray(competitions.status, ["published", "closed"]),
          eq(competitions.createdBy, userId),
        ),
      ),
    )
    .limit(1);

  if (!competition) return null;

  const competitionCategoryRows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      color: categories.color,
    })
    .from(competitionCategories)
    .innerJoin(categories, eq(competitionCategories.categoryId, categories.id))
    .where(eq(competitionCategories.competitionId, competitionId));

  return {
    ...competition,
    categories: competitionCategoryRows,
  };
}

export async function createCompetition(userId, data) {
  try {
    return await db.transaction(async (tx) => {
      const title = data.title.trim();
      const host = data.host.trim();
      const categoryIds = [...new Set(data.categoryIds)];

      const [existing] = await tx
        .select({ id: competitions.id })
        .from(competitions)
        .where(
          and(
            sql`lower(btrim(${competitions.title})) = ${title.toLowerCase()}`,
            sql`lower(btrim(${competitions.host})) = ${host.toLowerCase()}`,
          ),
        )
        .limit(1);

      if (existing) {
        return { error: "DUPLICATE_COMPETITION" };
      }

      const existingCategories = await tx
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          color: categories.color,
        })
        .from(categories)
        .where(inArray(categories.id, categoryIds));

      if (existingCategories.length !== categoryIds.length) {
        return { error: "CATEGORY_NOT_FOUND" };
      }

      const [competition] = await tx
        .insert(competitions)
        .values({
          title,
          description: data.description,
          deadline: data.deadline,
          maxTeamSize: data.maxTeamSize ?? null,
          host,
          sourceUrl: data.sourceUrl ?? null,
          imageUrl: data.imageUrl ?? null,
          createdBy: userId,
          createdByRole: "student",
        })
        .returning();

      await tx.insert(competitionCategories).values(
        categoryIds.map((categoryId) => ({
          competitionId: competition.id,
          categoryId,
        })),
      );

      return {
        ...competition,
        categories: existingCategories,
      };
    });
  } catch (error) {
    if (
      error.code === "23505" &&
      error.constraint_name === "competitions_title_host_unique"
    ) {
      return { error: "DUPLICATE_COMPETITION" };
    }

    throw error;
  }
}
