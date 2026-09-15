import type { SectionType } from "@/types";

export type EditorKind = "text" | "list" | "entries";

const TEXT_TYPES: SectionType[] = ["SUMMARY"];
const LIST_TYPES: SectionType[] = ["SKILLS", "LANGUAGES", "INTERESTS"];
const ENTRY_TYPES: SectionType[] = ["EXPERIENCE", "EDUCATION", "PROJECTS", "CERTIFICATIONS", "AWARDS", "REFERENCES"];

export function editorKindForType(type: SectionType): EditorKind {
  if (TEXT_TYPES.includes(type)) return "text";
  if (LIST_TYPES.includes(type)) return "list";
  if (ENTRY_TYPES.includes(type)) return "entries";
  return "text";
}

export interface SectionEntry {
  title: string;
  subtitle?: string;
  period?: string;
  description?: string;
}
