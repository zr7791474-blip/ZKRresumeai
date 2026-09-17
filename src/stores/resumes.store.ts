import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createDemoResume } from "@/data/demo-resume";
import type { ResumeSectionData, ResumeWithSections } from "@/types";

function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

interface ResumesState {
  resumes: ResumeWithSections[];
  getResume: (id: string) => ResumeWithSections | undefined;
  createResume: (input: { title: string; templateId?: string | null }) => ResumeWithSections;
  updateResume: (id: string, patch: Partial<Pick<ResumeWithSections, "title" | "data" | "isFavorite" | "status">>) => void;
  deleteResume: (id: string) => void;
  addSection: (resumeId: string, section: Omit<ResumeSectionData, "id">) => void;
  updateSection: (resumeId: string, sectionId: string, patch: Partial<Pick<ResumeSectionData, "content" | "title">>) => void;
  deleteSection: (resumeId: string, sectionId: string) => void;
}

export const useResumesStore = create<ResumesState>()(
  persist(
    (set, get) => ({
      resumes: [createDemoResume()],

      getResume: (id) => get().resumes.find((r) => r.id === id),

      createResume: ({ title, templateId = null }) => {
        const now = new Date().toISOString();
        const resume: ResumeWithSections = {
          id: generateId("resume"),
          title,
          templateId,
          status: "DRAFT",
          isFavorite: false,
          data: {},
          createdAt: now,
          updatedAt: now,
          sections: [],
        };
        set((state) => ({ resumes: [resume, ...state.resumes] }));
        return resume;
      },

      updateResume: (id, patch) => {
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === id ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r
          ),
        }));
      },

      deleteResume: (id) => {
        set((state) => ({ resumes: state.resumes.filter((r) => r.id !== id) }));
      },

      addSection: (resumeId, section) => {
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === resumeId
              ? {
                  ...r,
                  updatedAt: new Date().toISOString(),
                  sections: [...r.sections, { ...section, id: generateId("section") }],
                }
              : r
          ),
        }));
      },

      updateSection: (resumeId, sectionId, patch) => {
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === resumeId
              ? {
                  ...r,
                  updatedAt: new Date().toISOString(),
                  sections: r.sections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)),
                }
              : r
          ),
        }));
      },

      deleteSection: (resumeId, sectionId) => {
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === resumeId
              ? {
                  ...r,
                  updatedAt: new Date().toISOString(),
                  sections: r.sections.filter((s) => s.id !== sectionId).map((s, i) => ({ ...s, order: i })),
                }
              : r
          ),
        }));
      },
    }),
    { name: "zkr-demo-resumes" }
  )
);
