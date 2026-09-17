import type { ResumeSectionData } from "@/types";

/** Flattens a resume's sections into plain text for AI tools (scoring, ATS matching, cover letters). */
export function buildResumePlainText(data: Record<string, unknown>, sections: ResumeSectionData[]): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (!value) continue;
    lines.push(`${key}: ${value}`);
  }

  for (const section of sections.slice().sort((a, b) => a.order - b.order)) {
    lines.push(`\n${section.title || section.type}`);
    const content = section.content;

    if (typeof content.text === "string") {
      lines.push(content.text);
    }
    if (Array.isArray(content.items)) {
      lines.push((content.items as string[]).join(", "));
    }
    if (Array.isArray(content.entries)) {
      for (const entry of content.entries as Array<Record<string, unknown>>) {
        lines.push(
          [entry.title, entry.subtitle, entry.period].filter(Boolean).join(" — ")
        );
        if (entry.description) lines.push(String(entry.description));
      }
    }
  }

  return lines.join("\n").trim();
}
