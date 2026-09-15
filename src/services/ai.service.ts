import type { IAIRequestRepository } from "@/core/interfaces/repositories";
import type { IResumeRepository } from "@/core/interfaces/repositories";
import { AppError } from "@/core/errors/app.error";
import { AI_CREDIT_COSTS } from "@/constants";
import { getAIProvider } from "@/lib/ai/provider";
import type {
  GenerateSummaryDto,
  AtsOptimizeDto,
  RewriteDto,
  GrammarFixDto,
  ScoreResumeDto,
  CoverLetterDto,
  SkillsSuggestDto,
} from "@/validators/ai.validator";

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

  return [...Array.from(counts.entries())]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

function titleCase(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function fixGrammarHeuristically(text: string): string {
  let result = text.trim().replace(/\s+/g, " ");
  // Capitalize the start of each sentence.
  result = result.replace(/(^\s*\w|[.!?]\s+\w)/g, (match) => match.toUpperCase());
  // Ensure sentences end with terminal punctuation.
  if (result && !/[.!?]$/.test(result)) {
    result += ".";
  }
  // Collapse duplicated punctuation like ".." or "!!".
  result = result.replace(/([.!?]){2,}/g, "$1");
  return result;
}

const TONE_TEMPLATES: Record<string, (text: string) => string> = {
  professional: (t) => `${titleCase(t.charAt(0))}${t.slice(1)}`,
  confident: (t) => `${t.replace(/\bI (helped|assisted with|worked on)\b/gi, "I led")}`,
  "action-oriented": (t) => t.replace(/^([A-Za-z]+ed|[A-Za-z]+ing)?\s*/, "").trim(),
  concise: (t) => t.replace(/\b(very|really|basically|just|actually)\b\s*/gi, "").trim(),
};

export class AIService {
  constructor(
    private aiRepo: IAIRequestRepository,
    private resumeRepo: IResumeRepository
  ) {}

  private async deductCredits(userId: string, cost: number): Promise<void> {
    const { prisma } = await import("@/infra/database/prisma/client");
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError("User not found.", 404);
    }
    if (user.aiCredits < cost) {
      throw new AppError("Insufficient AI credits. Please upgrade your plan or wait for your credits to refill.", 403);
    }
    await prisma.user.update({
      where: { id: userId },
      data: { aiCredits: { decrement: cost } },
    });
  }

  /**
   * Tries the configured LLM provider (if any) first, and transparently falls
   * back to the deterministic heuristic on any failure — missing API key,
   * network error, rate limit, timeout, or malformed response. The caller
   * never has to know which path produced the result; only the logged
   * `model` field on the AIRequest row reflects it, for observability.
   */
  private async generateText(
    prompt: string,
    system: string,
    fallback: () => string
  ): Promise<{ text: string; model: string }> {
    const provider = getAIProvider();
    if (provider) {
      try {
        const text = await provider.complete(prompt, { system });
        return { text, model: process.env.OPENAI_MODEL || "gpt-4o-mini" };
      } catch (err) {
        console.error("AI provider call failed, falling back to heuristic engine:", err);
      }
    }
    return { text: fallback(), model: "zkr-heuristic-v1" };
  }

  async generateSummary(userId: string, dto: GenerateSummaryDto): Promise<string> {
    const cost = AI_CREDIT_COSTS.GENERATE_SUMMARY;
    await this.deductCredits(userId, cost);

    const topSkills = dto.skills.slice(0, 4).join(", ");
    const { text: result, model } = await this.generateText(
      `Write a 2-3 sentence professional resume summary for a ${dto.jobTitle} with ${dto.experience} of experience, highlighting these skills: ${dto.skills.join(", ")}. Write only the summary text, no preamble.`,
      "You are an expert resume writer. Write concise, achievement-oriented resume summaries.",
      () =>
        `Results-driven ${dto.jobTitle} with ${dto.experience} of hands-on experience. Proven track record of delivering measurable impact through ${topSkills}. Known for combining technical depth with clear communication to drive projects from idea to completion.`
    );

    await this.aiRepo.create({
      userId, type: "GENERATE_SUMMARY", input: dto, output: { result }, tokensUsed: result.length, model, status: "COMPLETED", completedAt: new Date(),
    });
    return result;
  }

  async atsOptimize(userId: string, dto: AtsOptimizeDto): Promise<Record<string, unknown>> {
    const cost = AI_CREDIT_COSTS.ATS_OPTIMIZE;
    await this.deductCredits(userId, cost);

    const jobKeywords = extractKeywords(dto.jobDescription, 15);
    const resumeLower = dto.resumeText.toLowerCase();
    const matched = jobKeywords.filter((kw) => resumeLower.includes(kw));
    const missing = jobKeywords.filter((kw) => !resumeLower.includes(kw));
    const score = Math.round((matched.length / Math.max(jobKeywords.length, 1)) * 100);

    const result = {
      optimizedText: dto.resumeText,
      matchedKeywords: matched,
      missingKeywords: missing.slice(0, 10),
      score,
    };

    await this.aiRepo.create({
      userId, type: "ATS_OPTIMIZE", input: dto, output: result, tokensUsed: dto.resumeText.length, model: "zkr-heuristic-v1", status: "COMPLETED", completedAt: new Date(),
    });
    return result;
  }

  async rewrite(userId: string, dto: RewriteDto): Promise<string> {
    const cost = AI_CREDIT_COSTS.REWRITE_SENTENCE;
    await this.deductCredits(userId, cost);

    const tone = dto.tone ?? "professional";
    const transform = TONE_TEMPLATES[tone] ?? TONE_TEMPLATES.professional;
    const { text: result, model } = await this.generateText(
      `Rewrite this resume bullet point in a ${tone} tone. Keep it factually the same, just improve the phrasing. Return only the rewritten text:\n\n${dto.text}`,
      "You are an expert resume editor. Rewrite bullet points to be punchy, specific, and achievement-oriented.",
      () => fixGrammarHeuristically(transform(dto.text))
    );

    await this.aiRepo.create({
      userId, type: "REWRITE_SENTENCE", input: dto, output: { result }, tokensUsed: result.length, model, status: "COMPLETED", completedAt: new Date(),
    });
    return result;
  }

  async grammarFix(userId: string, dto: GrammarFixDto): Promise<string> {
    const cost = AI_CREDIT_COSTS.GRAMMAR_FIX;
    await this.deductCredits(userId, cost);

    const { text: result, model } = await this.generateText(
      `Fix any grammar, spelling, and punctuation errors in this text. Do not change the meaning or tone. Return only the corrected text:\n\n${dto.text}`,
      "You are a meticulous copy editor.",
      () => fixGrammarHeuristically(dto.text)
    );

    await this.aiRepo.create({
      userId, type: "GRAMMAR_FIX", input: dto, output: { result }, tokensUsed: result.length, model, status: "COMPLETED", completedAt: new Date(),
    });
    return result;
  }

  async scoreResume(userId: string, dto: ScoreResumeDto): Promise<Record<string, unknown>> {
    const cost = AI_CREDIT_COSTS.RESUME_SCORE;
    await this.deductCredits(userId, cost);

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

    const result = {
      score,
      feedback: { structure, keywords, impact, formatting },
      suggestions: [
        !hasActionVerbs ? "Start bullet points with strong action verbs (Led, Built, Launched)." : null,
        !hasNumbers ? "Add measurable results and numbers to quantify your impact." : null,
        wordCount < 150 ? "Your resume looks short — consider adding more detail to key roles." : null,
      ].filter(Boolean),
    };

    await this.aiRepo.create({
      userId, type: "RESUME_SCORE", input: dto, output: result, tokensUsed: dto.resumeText.length, model: "zkr-heuristic-v1", status: "COMPLETED", completedAt: new Date(),
    });
    return result;
  }

  async coverLetter(userId: string, dto: CoverLetterDto): Promise<string> {
    const cost = AI_CREDIT_COSTS.COVER_LETTER;
    await this.deductCredits(userId, cost);

    const highlight = dto.resumeText.split(/\r?\n/).find((line) => line.trim().length > 20) ?? dto.resumeText.slice(0, 140);
    const fallbackLetter = `Dear Hiring Manager,

I am excited to apply for the ${dto.jobTitle} position at ${dto.companyName}. ${dto.jobDescription ? "Having reviewed the role, I" : "I"} believe my background is a strong match for what your team is building.

${highlight.trim()}

I would welcome the opportunity to discuss how my experience could contribute to ${dto.companyName}'s continued success. Thank you for your time and consideration.

Sincerely,
Applicant`;

    const { text: result, model } = await this.generateText(
      `Write a professional, 3-paragraph cover letter for a ${dto.jobTitle} position at ${dto.companyName}.${dto.jobDescription ? ` Job description: ${dto.jobDescription}` : ""}\n\nCandidate's resume content:\n${dto.resumeText}\n\nReturn only the letter body, starting with "Dear Hiring Manager,".`,
      "You are an expert career coach who writes compelling, specific cover letters grounded in the candidate's actual experience.",
      () => fallbackLetter
    );

    await this.aiRepo.create({
      userId, type: "COVER_LETTER", input: dto, output: { result }, tokensUsed: result.length, model, status: "COMPLETED", completedAt: new Date(),
    });
    return result;
  }

  async suggestSkills(userId: string, dto: SkillsSuggestDto): Promise<Record<string, string[]>> {
    const cost = AI_CREDIT_COSTS.SKILLS_SUGGEST;
    await this.deductCredits(userId, cost);

    const baselineByIndustry: Record<string, string[]> = {
      technology: ["System Design", "Cloud Infrastructure", "API Development", "Agile Methodology"],
      marketing: ["SEO", "Campaign Analytics", "Content Strategy", "A/B Testing"],
      finance: ["Financial Modeling", "Risk Analysis", "Forecasting", "Regulatory Compliance"],
      design: ["User Research", "Prototyping", "Design Systems", "Accessibility"],
      default: ["Leadership", "Strategic Planning", "Data-Driven Decision Making", "Cross-Functional Collaboration"],
    };

    const titleKeywords = dto.jobTitle.toLowerCase();
    const industryKey = dto.industry?.toLowerCase() ?? Object.keys(baselineByIndustry).find((key) => titleKeywords.includes(key)) ?? "default";
    const pool = baselineByIndustry[industryKey] ?? baselineByIndustry.default;
    const currentLower = dto.currentSkills.map((s) => s.toLowerCase());
    const suggested = pool.filter((skill) => !currentLower.includes(skill.toLowerCase()));

    const result = { suggested, missing: suggested.slice(0, 3) };

    await this.aiRepo.create({
      userId, type: "SKILLS_SUGGEST", input: dto, output: result, tokensUsed: 40, model: "zkr-heuristic-v1", status: "COMPLETED", completedAt: new Date(),
    });
    return result;
  }
}
