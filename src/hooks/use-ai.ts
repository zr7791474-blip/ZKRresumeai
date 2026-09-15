"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import type {
  GenerateSummaryDto,
  AtsOptimizeDto,
  RewriteDto,
  GrammarFixDto,
  ScoreResumeDto,
  CoverLetterDto,
  SkillsSuggestDto,
} from "@/validators/ai.validator";

async function callAi<T>(endpoint: string, token: string | null, body: unknown): Promise<T> {
  const res = await fetch(`/api/ai/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "AI request failed.");
  }
  return json.data as T;
}

function useToken() {
  return useAuthStore((s) => s.accessToken);
}

export function useGenerateSummary() {
  const token = useToken();
  return useMutation({
    mutationFn: (dto: GenerateSummaryDto) => callAi<{ result: string }>("summary", token, dto),
  });
}

export function useAtsOptimize() {
  const token = useToken();
  return useMutation({
    mutationFn: (dto: AtsOptimizeDto) =>
      callAi<{ optimizedText: string; matchedKeywords: string[]; missingKeywords: string[]; score: number }>(
        "ats-optimize",
        token,
        dto
      ),
  });
}

export function useRewrite() {
  const token = useToken();
  return useMutation({
    mutationFn: (dto: RewriteDto) => callAi<{ result: string }>("rewrite", token, dto),
  });
}

export function useGrammarFix() {
  const token = useToken();
  return useMutation({
    mutationFn: (dto: GrammarFixDto) => callAi<{ result: string }>("grammar-fix", token, dto),
  });
}

export function useScoreResume() {
  const token = useToken();
  return useMutation({
    mutationFn: (dto: ScoreResumeDto) =>
      callAi<{ score: number; feedback: Record<string, number>; suggestions: string[] }>("score", token, dto),
  });
}

export function useCoverLetter() {
  const token = useToken();
  return useMutation({
    mutationFn: (dto: CoverLetterDto) => callAi<{ result: string }>("cover-letter", token, dto),
  });
}

export function useSkillsSuggest() {
  const token = useToken();
  return useMutation({
    mutationFn: (dto: SkillsSuggestDto) =>
      callAi<{ suggested: string[]; missing: string[] }>("skills-suggest", token, dto),
  });
}
