/**
 * Deterministic, offline "AI" writing tools for the demo.
 *
 * These are the same heuristic algorithms the original product used as its
 * always-available fallback when no LLM API key was configured — no network
 * calls, no cost, no external dependency. That made them a natural fit to
 * keep as the demo's AI tools panel, running entirely in the browser.
 */

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with", "is",
  "are", "we", "you", "our", "your", "as", "at", "by", "be", "will", "this",
  "that", "it", "from", "have", "has", "who", "which", "their", "they",
]);

function extractKeywords(text: string, limit: number = 10): string[] {
  const counts = new Map<string, number>();
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9+.#\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

function titleCase(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function fixGrammarHeuristically(text: string): string {
  let result = text.trim().replace(/\s+/g, " ");
  result = result.replace(/(^\s*\w|[.!?]\s+\w)/g, (match) => match.toUpperCase());
  if (result && !/[.!?]$/.test(result)) {
    result += ".";
  }
  result = result.replace(/([.!?]){2,}/g, "$1");
  return result;
}

const TONE_TRANSFORMS: Record<string, (text: string) => string> = {
  professional: (t) => `${titleCase(t.charAt(0))}${t.slice(1)}`,
  confident: (t) => t.replace(/\bI (helped|assisted with|worked on)\b/gi, "I led"),
  "action-oriented": (t) => t.replace(/^([A-Za-z]+ed|[A-Za-z]+ing)?\s*/, "").trim(),
  concise: (t) => t.replace(/\b(very|really|basically|just|actually)\b\s*/gi, "").trim(),
};

export function generateSummary(dto: { jobTitle: string; experience: string; skills: string[] }): string {
  const topSkills = dto.skills.slice(0, 4).join(", ");
  return `Results-driven ${dto.jobTitle} with ${dto.experience} of hands-on experience. Proven track record of delivering measurable impact through ${topSkills}. Known for combining technical depth with clear communication to drive projects from idea to completion.`;
}

export function atsOptimize(dto: { resumeText: string; jobDescription: string }): {
  optimizedText: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  score: number;
} {
  const jobKeywords = extractKeywords(dto.jobDescription, 15);
  const resumeLower = dto.resumeText.toLowerCase();
  const matched = jobKeywords.filter((kw) => resumeLower.includes(kw));
  const missing = jobKeywords.filter((kw) => !resumeLower.includes(kw));
  const score = Math.round((matched.length / Math.max(jobKeywords.length, 1)) * 100);

  return {
    optimizedText: dto.resumeText,
    matchedKeywords: matched,
    missingKeywords: missing.slice(0, 10),
    score,
  };
}

export function rewriteText(dto: { text: string; tone?: string }): string {
  const tone = dto.tone ?? "professional";
  const transform = TONE_TRANSFORMS[tone] ?? TONE_TRANSFORMS.professional;
  return fixGrammarHeuristically(transform(dto.text));
}

export function grammarFix(dto: { text: string }): string {
  return fixGrammarHeuristically(dto.text);
}

export function scoreResume(dto: { resumeText: string; jobDescription?: string }): {
  score: number;
  feedback: Record<string, number>;
  suggestions: string[];
} {
  const wordCount = dto.resumeText.trim().split(/\s+/).filter(Boolean).length;
  const hasNumbers = /\d/.test(dto.resumeText);
  const hasActionVerbs = /\b(led|built|launched|designed|managed|improved|increased|reduced|delivered|created)\b/i.test(dto.resumeText);

  const structure = Math.min(100, 60 + (wordCount > 150 ? 20 : 0) + (wordCount > 300 ? 10 : 0));
  const impact = hasNumbers ? 85 : 55;
  const formatting = wordCount > 50 ? 82 : 60;
  let keywords = 70;

  if (dto.jobDescription) {
    const jobKeywords = extractKeywords(dto.jobDescription, 15);
    const resumeLower = dto.resumeText.toLowerCase();
    const matched = jobKeywords.filter((kw) => resumeLower.includes(kw));
    keywords = Math.round((matched.length / Math.max(jobKeywords.length, 1)) * 100);
  }

  const score = Math.round((structure + impact + formatting + keywords) / 4);

  return {
    score,
    feedback: { structure, keywords, impact, formatting },
    suggestions: [
      !hasActionVerbs ? "Start bullet points with strong action verbs (Led, Built, Launched)." : null,
      !hasNumbers ? "Add measurable results and numbers to quantify your impact." : null,
      wordCount < 150 ? "Your resume looks short — consider adding more detail to key roles." : null,
    ].filter((s): s is string => !!s),
  };
}

export function generateCoverLetter(dto: {
  companyName: string;
  jobTitle: string;
  jobDescription?: string;
  resumeText: string;
}): string {
  const highlight = dto.resumeText.split(/\r?\n/).find((line) => line.trim().length > 20) ?? dto.resumeText.slice(0, 140);
  return `Dear Hiring Manager,

I am excited to apply for the ${dto.jobTitle} position at ${dto.companyName}. ${dto.jobDescription ? "Having reviewed the role, I" : "I"} believe my background is a strong match for what your team is building.

${highlight.trim()}

I would welcome the opportunity to discuss how my experience could contribute to ${dto.companyName}'s continued success. Thank you for your time and consideration.

Sincerely,
Applicant`;
}

const SKILLS_BASELINE_BY_INDUSTRY: Record<string, string[]> = {
  technology: ["System Design", "Cloud Infrastructure", "API Development", "Agile Methodology"],
  marketing: ["SEO", "Campaign Analytics", "Content Strategy", "A/B Testing"],
  finance: ["Financial Modeling", "Risk Analysis", "Forecasting", "Regulatory Compliance"],
  design: ["User Research", "Prototyping", "Design Systems", "Accessibility"],
  default: ["Leadership", "Strategic Planning", "Data-Driven Decision Making", "Cross-Functional Collaboration"],
};

export function suggestSkills(dto: { jobTitle: string; industry?: string; currentSkills: string[] }): {
  suggested: string[];
  missing: string[];
} {
  const titleKeywords = dto.jobTitle.toLowerCase();
  const industryKey =
    dto.industry?.toLowerCase() ??
    Object.keys(SKILLS_BASELINE_BY_INDUSTRY).find((key) => titleKeywords.includes(key)) ??
    "default";
  const pool = SKILLS_BASELINE_BY_INDUSTRY[industryKey] ?? SKILLS_BASELINE_BY_INDUSTRY.default;
  const currentLower = dto.currentSkills.map((s) => s.toLowerCase());
  const suggested = pool.filter((skill) => !currentLower.includes(skill.toLowerCase()));

  return { suggested, missing: suggested.slice(0, 3) };
}
