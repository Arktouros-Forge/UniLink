import { createRandom, type Random } from "./random";

export type SeedContext = {
  rng: Random;
  now: number;
  ids: {
    skills: Map<string, string>;
    categories: Map<string, string>;
    lecturers: string[];
    students: string[];
    competitions: Map<string, string>;
  };
  students: SeedStudent[];
  skillsByUser: Map<string, string[]>;
};

export type SeedStudent = {
  id: string;
  fullName: string;
  year: string;
  major: string;
  phone: string;
  status: "active" | "blocked";
};

export const SEED_USER_IDS = {
  student: "00000000-0000-4000-8000-000000000001",
  admin: "00000000-0000-4000-8000-000000000002",
} as const;

export const SEED_CREDENTIALS = {
  student: { email: "ayu.pramesti@unilink.test", password: "Student123!" },
  admin: { email: "admin@unilink.test", password: "Admin123!" },
} as const;

export const seedUuid = (kind: number, n: number) =>
  `00000000-0000-4000-${String(8000 + kind)}-${String(n).padStart(12, "0")}`;

export function createContext(): SeedContext {
  return {
    rng: createRandom(Number(process.env.SEED_VALUE ?? 20261102)),
    now: process.env.SEED_NOW ? Date.parse(process.env.SEED_NOW) : Date.now(),
    ids: {
      skills: new Map(),
      categories: new Map(),
      lecturers: [],
      students: [],
      competitions: new Map(),
    },
    students: [],
    skillsByUser: new Map(),
  };
}
