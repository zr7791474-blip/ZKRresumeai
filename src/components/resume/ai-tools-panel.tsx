"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, Target, FileCheck, Wand2, MessageSquareText, ListPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  generateSummary,
  atsOptimize,
  rewriteText,
  grammarFix,
  scoreResume,
  generateCoverLetter,
  suggestSkills,
} from "@/lib/ai-tools";

function ResultBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  if (!text) return null;

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="relative rounded-lg border bg-muted/30 p-4 mt-3">
      <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-7 w-7" onClick={handleCopy} aria-label="Copy result">
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </Button>
      <p className="text-sm whitespace-pre-wrap pr-8">{text}</p>
    </div>
  );
}

export function AiToolsPanel({ resumeText }: { resumeText: string }) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center gap-2 p-4 border-b">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">AI Tools</h3>
        <Badge variant="outline" className="ml-auto text-[10px] font-normal">Demo</Badge>
      </div>
      <Tabs defaultValue="score" className="p-4">
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto gap-1 bg-transparent p-0">
          <TabsTrigger value="score" className="flex-col h-auto py-2 gap-1 text-[11px]"><Target className="h-3.5 w-3.5" />Score</TabsTrigger>
          <TabsTrigger value="summary" className="flex-col h-auto py-2 gap-1 text-[11px]"><Wand2 className="h-3.5 w-3.5" />Summary</TabsTrigger>
          <TabsTrigger value="ats" className="flex-col h-auto py-2 gap-1 text-[11px]"><FileCheck className="h-3.5 w-3.5" />ATS</TabsTrigger>
          <TabsTrigger value="rewrite" className="flex-col h-auto py-2 gap-1 text-[11px]"><MessageSquareText className="h-3.5 w-3.5" />Rewrite</TabsTrigger>
          <TabsTrigger value="cover" className="flex-col h-auto py-2 gap-1 text-[11px]"><FileCheck className="h-3.5 w-3.5" />Cover</TabsTrigger>
          <TabsTrigger value="skills" className="flex-col h-auto py-2 gap-1 text-[11px]"><ListPlus className="h-3.5 w-3.5" />Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="score" className="mt-4">
          <ScoreTool resumeText={resumeText} />
        </TabsContent>
        <TabsContent value="summary" className="mt-4">
          <SummaryTool />
        </TabsContent>
        <TabsContent value="ats" className="mt-4">
          <AtsTool resumeText={resumeText} />
        </TabsContent>
        <TabsContent value="rewrite" className="mt-4">
          <RewriteTool />
        </TabsContent>
        <TabsContent value="cover" className="mt-4">
          <CoverLetterTool resumeText={resumeText} />
        </TabsContent>
        <TabsContent value="skills" className="mt-4">
          <SkillsTool />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ScoreTool({ resumeText }: { resumeText: string }) {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ReturnType<typeof scoreResume> | null>(null);

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Job description (optional)</Label>
        <Textarea rows={3} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste a job description for keyword matching..." />
      </div>
      <Button size="sm" onClick={() => setResult(scoreResume({ resumeText, jobDescription: jobDescription || undefined }))} disabled={!resumeText.trim()}>
        <Target className="mr-2 h-3.5 w-3.5" />
        Score My Resume
      </Button>
      {!resumeText.trim() && <p className="text-xs text-muted-foreground">Add some content to your resume first.</p>}
      {result && (
        <div className="rounded-lg border p-4 mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Score</span>
            <Badge variant={result.score >= 75 ? "default" : "secondary"}>{result.score}/100</Badge>
          </div>
          {Object.entries(result.feedback).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="capitalize text-muted-foreground">{key}</span>
                <span>{value}%</span>
              </div>
              <Progress value={value} />
            </div>
          ))}
          {result.suggestions.length > 0 && (
            <ul className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
              {result.suggestions.map((s, i) => <li key={i}>&bull; {s}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryTool() {
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState("");

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder="Job title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
        <Input placeholder="Years of experience" value={experience} onChange={(e) => setExperience(e.target.value)} />
      </div>
      <Input placeholder="Key skills (comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} />
      <Button
        size="sm"
        onClick={() =>
          setResult(generateSummary({ jobTitle, experience, skills: skills.split(",").map((s) => s.trim()).filter(Boolean) }))
        }
        disabled={!jobTitle.trim() || !experience.trim()}
      >
        <Wand2 className="mr-2 h-3.5 w-3.5" />
        Generate Summary
      </Button>
      <ResultBlock text={result} />
    </div>
  );
}

function AtsTool({ resumeText }: { resumeText: string }) {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ReturnType<typeof atsOptimize> | null>(null);

  return (
    <div className="space-y-3">
      <Textarea rows={4} placeholder="Paste the job description here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
      <Button size="sm" onClick={() => setResult(atsOptimize({ resumeText, jobDescription }))} disabled={!jobDescription.trim() || !resumeText.trim()}>
        <FileCheck className="mr-2 h-3.5 w-3.5" />
        Check ATS Match
      </Button>
      {result && (
        <div className="rounded-lg border p-4 mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Match Score</span>
            <Badge>{result.score}%</Badge>
          </div>
          {result.missingKeywords.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Missing keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {result.missingKeywords.map((kw) => (
                  <Badge key={kw} variant="outline" className="text-xs">{kw}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RewriteTool() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState<"professional" | "confident" | "action-oriented" | "concise">("professional");
  const [result, setResult] = useState("");

  return (
    <div className="space-y-3">
      <Textarea rows={4} placeholder="Paste a sentence or bullet point to improve..." value={text} onChange={(e) => setText(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        {(["professional", "confident", "action-oriented", "concise"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTone(t)}
            aria-pressed={tone === t}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${tone === t ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => setResult(rewriteText({ text, tone }))} disabled={!text.trim()}>
          <MessageSquareText className="mr-2 h-3.5 w-3.5" />
          Rewrite
        </Button>
        <Button size="sm" variant="outline" onClick={() => setResult(grammarFix({ text }))} disabled={!text.trim()}>
          Fix Grammar
        </Button>
      </div>
      <ResultBlock text={result} />
    </div>
  );
}

function CoverLetterTool({ resumeText }: { resumeText: string }) {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState("");

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder="Company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        <Input placeholder="Job title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
      </div>
      <Textarea rows={3} placeholder="Job description (optional)" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
      <Button
        size="sm"
        onClick={() => setResult(generateCoverLetter({ companyName, jobTitle, jobDescription: jobDescription || undefined, resumeText }))}
        disabled={!companyName.trim() || !jobTitle.trim() || !resumeText.trim()}
      >
        <FileCheck className="mr-2 h-3.5 w-3.5" />
        Generate Cover Letter
      </Button>
      {!resumeText.trim() && <p className="text-xs text-muted-foreground">Add some resume content first so the letter can reference it.</p>}
      <ResultBlock text={result} />
    </div>
  );
}

function SkillsTool() {
  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [currentSkills, setCurrentSkills] = useState("");
  const [result, setResult] = useState<ReturnType<typeof suggestSkills> | null>(null);

  return (
    <div className="space-y-3">
      <Input placeholder="Job title (e.g. Product Manager)" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
      <Input placeholder="Industry (optional — e.g. technology, marketing, finance, design)" value={industry} onChange={(e) => setIndustry(e.target.value)} />
      <Input placeholder="Current skills (comma separated)" value={currentSkills} onChange={(e) => setCurrentSkills(e.target.value)} />
      <Button
        size="sm"
        onClick={() =>
          setResult(
            suggestSkills({ jobTitle, industry: industry || undefined, currentSkills: currentSkills.split(",").map((s) => s.trim()).filter(Boolean) })
          )
        }
        disabled={!jobTitle.trim()}
      >
        <ListPlus className="mr-2 h-3.5 w-3.5" />
        Suggest Skills
      </Button>
      {result && result.suggested.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {result.suggested.map((skill) => (
            <Badge key={skill} variant="secondary">{skill}</Badge>
          ))}
        </div>
      )}
    </div>
  );
}
