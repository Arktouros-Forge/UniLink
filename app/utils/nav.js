export const matchesPath = (path, to) =>
  path === to || path.startsWith(`${to}/`);

export const activeNavTo = (path, targets) =>
  targets
    .filter((to) => matchesPath(path, to))
    .sort((a, b) => b.length - a.length)[0] ?? null;
