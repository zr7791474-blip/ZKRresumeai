"use client";

import { useResumesStore } from "@/stores/resumes.store";

export function useResumes() {
  return useResumesStore((s) => s.resumes);
}

export function useResume(id: string | undefined) {
  return useResumesStore((s) => (id ? s.resumes.find((r) => r.id === id) : undefined));
}

export function useResumesActions() {
  return useResumesStore((s) => ({
    createResume: s.createResume,
    updateResume: s.updateResume,
    deleteResume: s.deleteResume,
    addSection: s.addSection,
    updateSection: s.updateSection,
    deleteSection: s.deleteSection,
  }));
}
