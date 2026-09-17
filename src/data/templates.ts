export interface ResumeTemplateDef {
  id: string;
  name: string;
  category: string;
  description: string;
  /** Longer copy shown on the individual template preview page. */
  longDescription: string;
  accent: string;
}

export const TEMPLATES: ResumeTemplateDef[] = [
  {
    id: "modern",
    name: "Modern",
    category: "Clean",
    description: "A crisp, contemporary layout with a bold header.",
    longDescription:
      "A bold color header anchors the page, with a clean single-column body underneath. Built for candidates in fast-moving fields like marketing, product, and growth who want a layout that feels current without being loud.",
    accent: "from-blue-500 to-cyan-400",
  },
  {
    id: "corporate",
    name: "Corporate",
    category: "Professional",
    description: "Traditional structure trusted by hiring managers.",
    longDescription:
      "A dense, traditional layout that puts information density first. Favored by analysts, consultants, and finance professionals applying to established companies where a conventional format signals attention to convention.",
    accent: "from-slate-700 to-slate-500",
  },
  {
    id: "elegant",
    name: "Elegant",
    category: "Classic",
    description: "Refined typography for a polished, timeless feel.",
    longDescription:
      "A centered masthead with generous letter-spacing gives this template a refined, editorial feel. Works well for research, academic, and creative-adjacent roles where craft and typography matter.",
    accent: "from-rose-400 to-orange-300",
  },
  {
    id: "creative",
    name: "Creative",
    category: "Bold",
    description: "Stand out with color and confident layout choices.",
    longDescription:
      "A colored sidebar carries your identity while the main column stays focused on experience. Built for designers and creatives who want a resume that reflects their visual sense without sacrificing readability.",
    accent: "from-fuchsia-500 to-purple-500",
  },
  {
    id: "executive",
    name: "Executive",
    category: "Professional",
    description: "Understated and senior — built for leadership roles.",
    longDescription:
      "An understated, dense layout that lets a long track record speak for itself. Designed for VP, director, and C-suite candidates whose resume needs to cover scope and scale without feeling cluttered.",
    accent: "from-emerald-600 to-teal-500",
  },
  {
    id: "minimal",
    name: "Minimal",
    category: "Clean",
    description: "Just the essentials, laid out with plenty of space.",
    longDescription:
      "Generous whitespace and a restrained type scale keep the focus entirely on content. A strong choice for engineers and technical roles where a resume should read fast and skip decoration.",
    accent: "from-gray-400 to-gray-600",
  },
];

export function getTemplateById(id: string | undefined | null): ResumeTemplateDef | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
