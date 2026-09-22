import type { StoredLearnPack } from "@/lib/learn-pack-store";
import type { LearnQuestion } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fcvzuerxfblxecojglwy.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjdnp1ZXJ4ZmJseGVjb2pnbHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMjg1NzksImV4cCI6MjA5NzkwNDU3OX0.1b60DYGoxwA-F6d6iPs5G6rw5Jp02TVFFlgnnQKmNz4";

type ApiPack = Record<string, unknown>;

function toStoredPack(pack: ApiPack): StoredLearnPack {
  return {
    id: String(pack.id), title: String(pack.title), subject: String(pack.subject), topic: String(pack.topic),
    yearGroup: String(pack.year_group), curriculum: String(pack.curriculum || "Not specified"),
    difficulty: String(pack.difficulty || "Mixed"), status: pack.status as StoredLearnPack["status"],
    days: Number(pack.duration_days || 5), createdAt: String(pack.created_at).slice(0, 10),
    assignedCount: Number(pack.assigned_count || 0), completions: Number(pack.completions || 0),
  };
}

async function request<T>(token: string, method: string, body?: unknown): Promise<T> {
  const response = await fetch(`${supabaseUrl}/functions/v1/learn-packs`, {
    method,
    headers: { Authorization: `Bearer ${token}`, apikey: supabaseAnonKey, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Could not save learning pack");
  return data as T;
}

export function isLearnPackServiceUnavailable(error: unknown) {
  return error instanceof TypeError || (error instanceof Error && /failed to fetch|networkerror|load failed/i.test(error.message));
}

export async function fetchLearnPacks(token: string) {
  const data = await request<{ packs: ApiPack[] }>(token, "GET");
  return data.packs.map(toStoredPack);
}

export async function createLearnPack(token: string, pack: StoredLearnPack, generationConfig: Record<string, unknown> = {}) {
  const data = await request<{ pack: ApiPack }>(token, "POST", {
    title: pack.title, subject: pack.subject, topic: pack.topic, yearGroup: pack.yearGroup,
    curriculum: pack.curriculum, difficulty: pack.difficulty, durationDays: pack.days, generationConfig,
  });
  return toStoredPack(data.pack);
}

export async function setLearnPackStatus(token: string, id: string, status: StoredLearnPack["status"]) {
  const data = await request<{ pack: ApiPack }>(token, "PATCH", { id, status });
  return toStoredPack(data.pack);
}

export async function updateLearnPackDetails(token: string, pack: StoredLearnPack) {
  const data = await request<{ pack: ApiPack }>(token, "PATCH", {
    id: pack.id, title: pack.title, subject: pack.subject, topic: pack.topic, yearGroup: pack.yearGroup,
    curriculum: pack.curriculum, difficulty: pack.difficulty, durationDays: pack.days,
  });
  return toStoredPack(data.pack);
}

export async function removeLearnPack(token: string, id: string) {
  await request<{ success: true }>(token, "DELETE", { id });
}

export async function generateAiLearnPack(token: string, input: { subject: string; topic: string; yearGroup: string; curriculum: string; difficulty: string; questionCount: number; notes?: string }) {
  const response = await fetch(`${supabaseUrl}/functions/v1/ai-learn-pack`, {
    method: "POST", headers: { Authorization: `Bearer ${token}`, apikey: supabaseAnonKey, "Content-Type": "application/json" }, body: JSON.stringify(input),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Could not generate learning-pack questions");
  if (!Array.isArray(data.questions)) throw new Error("The AI service returned no questions");
  return data.questions.map((question: Omit<LearnQuestion, "isExample" | "exNum" | "clTopic" | "clIdx">, index: number): LearnQuestion => ({
    ...question, isExample: index === 0, exNum: index === 0 ? 1 : 0, clTopic: input.topic, clIdx: (index % 4) as 0 | 1 | 2 | 3,
  }));
}
