import type { LearnQuestion } from "@/lib/types";

export type StoredLearnPack = {
  id: string;
  title: string;
  subject: string;
  topic: string;
  yearGroup: string;
  curriculum: string;
  difficulty: string;
  status: "published" | "draft" | "archived";
  days: number;
  createdAt: string;
  assignedCount: number;
  completions: number;
  questions?: LearnQuestion[];
};

const STORAGE_KEY = "dovet_learn_packs";

const INITIAL_PACKS: StoredLearnPack[] = [];

function canUseStorage() {
  return typeof window !== "undefined";
}

function withoutLegacySamplePacks(packs: StoredLearnPack[]) {
  return packs.filter((pack) => {
    if (["1", "2", "3"].includes(pack.id)) return false;
    const containsIctFixture = pack.questions?.some((question) => /algorithm|flowchart/i.test(question.text)) ?? false;
    return !containsIctFixture || /ict|computer science/i.test(pack.subject);
  });
}

export function getLearnPacks(): StoredLearnPack[] {
  if (!canUseStorage()) return INITIAL_PACKS;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const packs = saved ? JSON.parse(saved) : null;
    return Array.isArray(packs) ? withoutLegacySamplePacks(packs) : INITIAL_PACKS;
  } catch {
    return INITIAL_PACKS;
  }
}

export function saveLearnPacks(packs: StoredLearnPack[]) {
  if (canUseStorage()) localStorage.setItem(STORAGE_KEY, JSON.stringify(packs));
}

export function addLearnPack(pack: StoredLearnPack): StoredLearnPack[] {
  const next = [pack, ...getLearnPacks()];
  saveLearnPacks(next);
  return next;
}

export function updateLearnPack(id: string, changes: Partial<StoredLearnPack>): StoredLearnPack[] {
  const next = getLearnPacks().map((pack) => pack.id === id ? { ...pack, ...changes } : pack);
  saveLearnPacks(next);
  return next;
}

export function deleteLearnPack(id: string): StoredLearnPack[] {
  const next = getLearnPacks().filter((pack) => pack.id !== id);
  saveLearnPacks(next);
  return next;
}
