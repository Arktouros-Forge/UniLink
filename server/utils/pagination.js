export const pageMeta = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});

export const pageOffset = ({ page, limit }) => (page - 1) * limit;

export const likePattern = (value) => `%${value.replace(/[\\%_]/g, "\\$&")}%`;
