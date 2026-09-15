"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import type { CreateResumeDto, UpdateResumeDto, CreateSectionDto, UpdateSectionDto } from "@/validators/resume.validator";
import type { ResumeWithSections } from "@/types";

async function apiRequest<T>(url: string, token: string | null, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    credentials: "include",
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Something went wrong.");
  }
  return json.data as T;
}

export function useResumes() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["resumes"],
    queryFn: () => apiRequest<ResumeWithSections[]>("/api/resumes", accessToken),
    enabled: !!accessToken,
  });
}

export function useResume(id: string | undefined) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["resumes", id],
    queryFn: () => apiRequest<ResumeWithSections>(`/api/resumes/${id}`, accessToken),
    enabled: !!accessToken && !!id,
  });
}

export function useCreateResume() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResumeDto) =>
      apiRequest<ResumeWithSections>("/api/resumes", accessToken, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
}

export function useUpdateResume(id: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateResumeDto) =>
      apiRequest<ResumeWithSections>(`/api/resumes/${id}`, accessToken, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["resumes", id] });
    },
  });
}

export function useDeleteResume() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest<{ deleted: boolean }>(`/api/resumes/${id}`, accessToken, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
}

export function useAddSection(resumeId: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSectionDto) =>
      apiRequest(`/api/resumes/${resumeId}/sections`, accessToken, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", resumeId] });
    },
  });
}

export function useUpdateSection(resumeId: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, data }: { sectionId: string; data: UpdateSectionDto }) =>
      apiRequest(`/api/resumes/${resumeId}/sections/${sectionId}`, accessToken, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", resumeId] });
    },
  });
}

export function useDeleteSection(resumeId: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sectionId: string) =>
      apiRequest(`/api/resumes/${resumeId}/sections/${sectionId}`, accessToken, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", resumeId] });
    },
  });
}

export async function exportResume(resumeId: string, accessToken: string | null, format: "PDF" | "DOCX" | "JSON") {
  const res = await fetch(`/api/resumes/${resumeId}/export`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify({ format }),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({ error: "Export failed." }));
    throw new Error(json.error || "Export failed.");
  }

  const blob = await res.blob();
  const disposition = res.headers.get("Content-Disposition") || "";
  const match = disposition.match(/filename="(.+)"/);
  const filename = match?.[1] || `resume.${format.toLowerCase()}`;

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
