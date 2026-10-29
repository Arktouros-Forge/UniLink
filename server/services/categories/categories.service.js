import { asc, count, eq, ilike, or } from "drizzle-orm";
import { db } from "@database/index";
import { categories } from "@database/schema/index";

export async function getCategories({ q, page, limit }) {
  const conditions = q
    ? or(
        ilike(categories.name, `%${q}%`),
        ilike(categories.slug, `%${q}%`),
        ilike(categories.description, `%${q}%`),
      )
    : undefined;

  const offset = (page - 1) * limit;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        color: categories.color,
      })
      .from(categories)
      .where(conditions)
      .orderBy(asc(categories.name))
      .limit(limit)
      .offset(offset),

    db.select({ total: count() }).from(categories).where(conditions),
  ]);

  return {
    categories: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getCategoryById(categoryId) {
  const [category] = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      color: categories.color,
    })
    .from(categories)
    .where(eq(categories.id, categoryId))
    .limit(1);

  return category ?? null;
}
