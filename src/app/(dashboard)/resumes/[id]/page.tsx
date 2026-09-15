"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Plus, Trash2, Save, Download, Loader2, Star, ChevronDown, ChevronUp, FileText,
} from "lucide-react";
import { useResume, useUpdateResume, useAddSection, useUpdateSection, useDeleteSection, exportResume } from "@/hooks/use-resumes";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { SectionContentEditor } from "@/components/resume/section-content-editor";
import { AiToolsPanel } from "@/components/resume/ai-tools-panel";
import { SECTION_TYPES } from "@/constants";
import { buildResumePlainText } from "@/lib/resume-text";
import type { ResumeSectionData, SectionType } from "@/types";

const ADDABLE_SECTION_TYPES = SECTION_TYPES.filter((t) => t.value !== "PERSONAL_INFO");

export default function ResumeEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const accessToken = useAuthStore((s) => s.accessToken);

  const { data: resume, isLoading, isError, error } = useResume(params.id);
  const updateResume = useUpdateResume(params.id);
  const addSection = useAddSection(params.id);

  const [title, setTitle] = useState("");
  const [personalInfo, setPersonalInfo] = useState<Record<string, string>>({});
  const [newSectionType, setNewSectionType] = useState<SectionType | "">("");
  const [exporting, setExporting] = useState<"PDF" | "DOCX" | "JSON" | null>(null);

  useEffect(() => {
    if (resume) {
      setTitle(resume.title);
      setPersonalInfo({
        fullName: (resume.data.fullName as string) || "",
        email: (resume.data.email as string) || "",
        phone: (resume.data.phone as string) || "",
        location: (resume.data.location as string) || "",
        website: (resume.data.website as string) || "",
      });
    }
  }, [resume]);

  async function saveTitle() {
    if (!resume || title.trim() === resume.title || !title.trim()) return;
    try {
      await updateResume.mutateAsync({ title: title.trim() });
    } catch (err) {
      toast({ title: "Couldn't save title", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    }
  }

  async function savePersonalInfo() {
    try {
      await updateResume.mutateAsync({ data: personalInfo });
      toast({ title: "Personal info saved" });
    } catch (err) {
      toast({ title: "Couldn't save", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    }
  }

  async function handleAddSection() {
    if (!newSectionType || !resume) return;
    try {
      await addSection.mutateAsync({
        type: newSectionType,
        title: SECTION_TYPES.find((t) => t.value === newSectionType)?.label ?? undefined,
        content: {},
        order: resume.sections.length,
      });
      setNewSectionType("");
    } catch (err) {
      toast({ title: "Couldn't add section", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    }
  }

  async function handleToggleFavorite() {
    if (!resume) return;
    try {
      await updateResume.mutateAsync({ isFavorite: !resume.isFavorite });
    } catch (err) {
      toast({ title: "Couldn't update favorite", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    }
  }

  async function handleExport(format: "PDF" | "DOCX" | "JSON") {
    setExporting(format);
    try {
      await exportResume(params.id, accessToken, format);
    } catch (err) {
      toast({ title: "Export failed", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    } finally {
      setExporting(null);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !resume) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-muted-foreground mb-4">{error instanceof Error ? error.message : "Resume not found."}</p>
        <Button variant="outline" asChild>
          <Link href="/resumes"><ArrowLeft className="mr-2 h-4 w-4" />Back to resumes</Link>
        </Button>
      </div>
    );
  }

  const resumeText = buildResumePlainText(resume.data, resume.sections);
  const sortedSections = resume.sections.slice().sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild aria-label="Back to resumes">
          <Link href="/resumes"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveTitle}
          className="text-lg font-semibold border-none shadow-none px-0 h-auto focus-visible:ring-0"
        />
        <Badge variant={resume.status === "PUBLISHED" ? "default" : "secondary"} className="shrink-0">{resume.status}</Badge>
        <Button variant="ghost" size="icon" onClick={handleToggleFavorite} aria-label="Toggle favorite" className="shrink-0">
          <Star className={resume.isFavorite ? "h-4 w-4 fill-amber-400 text-amber-400" : "h-4 w-4"} />
        </Button>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={!!exporting}>
                {exporting ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Download className="mr-2 h-3.5 w-3.5" />}
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("PDF")}>PDF</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("DOCX")}>DOCX</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("JSON")}>JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="text-sm font-semibold">Personal Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Full Name</Label>
                  <Input value={personalInfo.fullName ?? ""} onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Email</Label>
                  <Input value={personalInfo.email ?? ""} onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Phone</Label>
                  <Input value={personalInfo.phone ?? ""} onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Location</Label>
                  <Input value={personalInfo.location ?? ""} onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs">Website / Portfolio</Label>
                  <Input value={personalInfo.website ?? ""} onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })} />
                </div>
              </div>
              <Button size="sm" onClick={savePersonalInfo} disabled={updateResume.isPending}>
                {updateResume.isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                <Save className="mr-2 h-3.5 w-3.5" />Save
              </Button>
            </CardContent>
          </Card>

          {sortedSections.map((section) => (
            <SectionCard key={section.id} section={section} resumeId={params.id} />
          ))}

          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold mb-3">Add a section</h3>
              <div className="flex gap-2">
                <Select value={newSectionType} onValueChange={(v) => setNewSectionType(v as SectionType)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Choose a section type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADDABLE_SECTION_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddSection} disabled={!newSectionType || addSection.isPending}>
                  {addSection.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
              </div>
              {sortedSections.length === 0 && (
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />Add sections like Experience, Education, and Skills to build out your resume.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="lg:sticky lg:top-24">
            <AiToolsPanel resumeText={resumeText} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ section, resumeId }: { section: ResumeSectionData; resumeId: string }) {
  const { toast } = useToast();
  const updateSection = useUpdateSection(resumeId);
  const deleteSection = useDeleteSection(resumeId);
  const [content, setContent] = useState(section.content);
  const [collapsed, setCollapsed] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    setContent(section.content);
    setDirty(false);
  }, [section.content]);

  useEffect(() => {
    if (!dirty) return;
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

  function handleChange(next: Record<string, unknown>) {
    setContent(next);
    setDirty(true);
  }

  async function handleSave() {
    try {
      await updateSection.mutateAsync({ sectionId: section.id, data: { content } });
      setDirty(false);
      toast({ title: "Section saved" });
    } catch (err) {
      toast({ title: "Couldn't save section", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    }
  }

  async function handleDelete() {
    try {
      await deleteSection.mutateAsync(section.id);
      toast({ title: "Section deleted" });
    } catch (err) {
      toast({ title: "Couldn't delete section", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    } finally {
      setConfirmingDelete(false);
    }
  }

  const label = section.title || section.type.charAt(0) + section.type.slice(1).toLowerCase().replace(/_/g, " ");

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-expanded={!collapsed}
            className="flex items-center gap-2 text-sm font-semibold rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            {label}
          </button>
          <div className="flex items-center gap-2">
            {dirty && (
              <Button size="sm" variant="outline" onClick={handleSave} disabled={updateSection.isPending}>
                {updateSection.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                <Save className="mr-1.5 h-3.5 w-3.5" />Save
              </Button>
            )}
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setConfirmingDelete(true)} aria-label={`Delete ${label} section`} disabled={deleteSection.isPending}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        {!collapsed && <SectionContentEditor type={section.type} content={content} onChange={handleChange} />}
      </CardContent>

      <Dialog open={confirmingDelete} onOpenChange={setConfirmingDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete &ldquo;{label}&rdquo;?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. This section and its content will be permanently removed from the resume.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmingDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteSection.isPending}>
              {deleteSection.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
