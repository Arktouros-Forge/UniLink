export function createRandom(seed: number) {
  let state = seed >>> 0;

  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const int = (min: number, max: number) =>
    Math.floor(next() * (max - min + 1)) + min;

  const pick = <T>(list: readonly T[]): T => list[int(0, list.length - 1)];

  const chance = (probability: number) => next() < probability;

  const shuffle = <T>(list: readonly T[]): T[] => {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = int(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const sample = <T>(list: readonly T[], count: number): T[] =>
    shuffle(list).slice(0, Math.min(count, list.length));

  const weighted = <T>(entries: readonly (readonly [T, number])[]): T => {
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = next() * total;
    for (const [value, weight] of entries) {
      roll -= weight;
      if (roll <= 0) return value;
    }
    return entries[entries.length - 1][0];
  };

  return { next, int, pick, chance, shuffle, sample, weighted };
}

export type Random = ReturnType<typeof createRandom>;

export const DAY_MS = 86_400_000;

export const daysFromNow = (days: number, now = Date.now()) =>
  new Date(now + days * DAY_MS);

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " dan ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function chunk<T>(list: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}
