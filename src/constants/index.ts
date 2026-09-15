export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "ZKR Resume AI";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const FOOTER_LINKS = {
  twitter: "https://x.com/zkr_ad",
  github: "https://github.com/zr7791474-blip",
  whatsapp: "https://wa.me/212657516301",
  instagram: "https://instagram.com/zkr_ad",
  email: "zr7791474@gmail.com",
} as const;

export const PUBLIC_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;

export const DASHBOARD_NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/resumes", label: "My Resumes" },
  { href: "/dashboard/templates", label: "Templates" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
] as const;

export interface ResumeTemplateDef {
  id: string;
  name: string;
  category: string;
  description: string;
  accent: string;
}

export const TEMPLATES: ResumeTemplateDef[] = [
  { id: "modern", name: "Modern", category: "Clean", description: "A crisp, contemporary layout with a bold header.", accent: "from-blue-500 to-cyan-400" },
  { id: "corporate", name: "Corporate", category: "Professional", description: "Traditional structure trusted by hiring managers.", accent: "from-slate-700 to-slate-500" },
  { id: "elegant", name: "Elegant", category: "Classic", description: "Refined typography for a polished, timeless feel.", accent: "from-rose-400 to-orange-300" },
  { id: "creative", name: "Creative", category: "Bold", description: "Stand out with color and confident layout choices.", accent: "from-fuchsia-500 to-purple-500" },
  { id: "executive", name: "Executive", category: "Professional", description: "Understated and senior — built for leadership roles.", accent: "from-emerald-600 to-teal-500" },
  { id: "minimal", name: "Minimal", category: "Clean", description: "Just the essentials, laid out with plenty of space.", accent: "from-gray-400 to-gray-600" },
];

export const SECTION_TYPES = [
  { value: "PERSONAL_INFO", label: "Personal Info" },
  { value: "SUMMARY", label: "Summary" },
  { value: "EXPERIENCE", label: "Experience" },
  { value: "EDUCATION", label: "Education" },
  { value: "SKILLS", label: "Skills" },
  { value: "LANGUAGES", label: "Languages" },
  { value: "PROJECTS", label: "Projects" },
  { value: "CERTIFICATIONS", label: "Certifications" },
  { value: "AWARDS", label: "Awards" },
  { value: "INTERESTS", label: "Interests" },
  { value: "REFERENCES", label: "References" },
] as const;

export const AI_CREDIT_COSTS: Record<string, number> = {
  GENERATE_SUMMARY: 1,
  ATS_OPTIMIZE: 2,
  REWRITE_SENTENCE: 1,
  GRAMMAR_FIX: 1,
  RESUME_SCORE: 2,
  COVER_LETTER: 3,
  SKILLS_SUGGEST: 1,
};
