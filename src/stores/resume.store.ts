import { create } from "zustand";
import type { ResumeWithSections, ResumeSectionData } from "@/types";

interface ResumeState {
  currentResume: ResumeWithSections | null;
  selectedSectionId: string | null;
  isPreviewMode: boolean;
  setCurrentResume: (resume: ResumeWithSections | null) => void;
  setSelectedSectionId: (id: string | null) => void;
  setPreviewMode: (mode: boolean) => void;
  updateSectionLocally: (sectionId: string, updates: Partial<ResumeSectionData>) => void;
  addSectionLocally: (section: ResumeSectionData) => void;
  removeSectionLocally: (sectionId: string) => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  currentResume: null,
  selectedSectionId: null,
  isPreviewMode: false,
  setCurrentResume: (currentResume) => set({ currentResume, selectedSectionId: null }),
  setSelectedSectionId: (selectedSectionId) => set({ selectedSectionId }),
  setPreviewMode: (isPreviewMode) => set({ isPreviewMode }),
  updateSectionLocally: (sectionId, updates) =>
    set((state) => {
      if (!state.currentResume) return state;
      return {
        currentResume: {
          ...state.currentResume,
          sections: state.currentResume.sections.map((s) =>
            s.id === sectionId ? { ...s, ...updates } : s
          ),
        },
      };
    }),
  addSectionLocally: (section) =>
    set((state) => {
      if (!state.currentResume) return state;
      return {
        currentResume: {
          ...state.currentResume,
          sections: [...state.currentResume.sections, section],
        },
      };
    }),
  removeSectionLocally: (sectionId) =>
    set((state) => {
      if (!state.currentResume) return state;
      return {
        currentResume: {
          ...state.currentResume,
          sections: state.currentResume.sections
            .filter((s) => s.id !== sectionId)
            .map((s, i) => ({ ...s, order: i })),
        },
      };
    }),
}));