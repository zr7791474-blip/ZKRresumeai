"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Plus, Star, MoreVertical, Trash2, Download, Loader2 } from "lucide-react";
import { useResumes, useCreateResume, useDeleteResume, useUpdateResume, exportResume } from "@/hooks/use-resumes";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/shared/empty-state";
import { useToast } from "@/components/ui/use-toast";
import { formatDate, cn } from "@/lib/utils";

function CreateResumeDialog() {
  const router = useRouter();
  const { toast } = useToast();
  const createResume = useCreateResume();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  async function handleCreate() {
    if (!title.trim()) return;
    try {
      const resume = await createResume.mutateAsync({ title: title.trim() });
      setOpen(false);
      setTitle("");
      toast({ title: "Resume created", description: `"${resume.title}" is ready to edit.` });
      router.push(`/resumes/${resume.id}`);
    } catch (error) {
      toast({ title: "Couldn't create resume", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="mr-2 h-4 w-4" />New Resume</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new resume</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="resume-title">Title</Label>
          <Input
            id="resume-title"
            placeholder="e.g. Senior Product Designer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!title.trim() || createResume.isPending}>
            {createResume.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ResumesPage() {
  const { data: resumes, isLoading } = useResumes();
  const deleteResume = useDeleteResume();
  const accessToken = useAuthStore((s) => s.accessToken);
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    try {
      await deleteResume.mutateAsync(id);
      toast({ title: "Resume deleted" });
    } catch (error) {
      toast({ title: "Couldn't delete resume", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  }

  async function handleExport(id: string, format: "PDF" | "DOCX" | "JSON") {
    setExportingId(id);
    try {
      await exportResume(id, accessToken, format);
    } catch (error) {
      toast({ title: "Export failed", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    } finally {
      setExportingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Resumes</h1>
          <p className="text-sm text-muted-foreground mt-1">Create, edit, and export your resumes.</p>
        </div>
        <CreateResumeDialog />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
        </div>
      ) : !resumes || resumes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No resumes yet"
          description="Create your first resume and start writing with AI assistance."
          action={<CreateResumeDialog />}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onDelete={() => setDeletingId(resume.id)}
              onExport={(format) => handleExport(resume.id, format)}
              exporting={exportingId === resume.id}
            />
          ))}
        </div>
      )}

      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this resume?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone. The resume will be permanently removed.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deletingId && handleDelete(deletingId)} disabled={deleteResume.isPending}>
              {deleteResume.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ResumeCardProps {
  resume: { id: string; title: string; status: string; isFavorite: boolean; updatedAt: string | Date };
  onDelete: () => void;
  onExport: (format: "PDF" | "DOCX" | "JSON") => void;
  exporting: boolean;
}

function ResumeCard({ resume, onDelete, onExport, exporting }: ResumeCardProps) {
  const updateResume = useUpdateResume(resume.id);
  const { toast } = useToast();

  function handleToggleFavorite() {
    updateResume.mutate(
      { isFavorite: !resume.isFavorite },
      {
        onError: (error) => {
          toast({ title: "Couldn't update favorite", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
        },
      }
    );
  }

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <Link href={`/resumes/${resume.id}`} className="flex items-center gap-3 min-w-0 flex-1">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{resume.title}</p>
              <p className="text-xs text-muted-foreground">Updated {formatDate(resume.updatedAt)}</p>
            </div>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label="Resume actions">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onExport("PDF")} disabled={exporting}>
                <Download className="mr-2 h-4 w-4" />Export PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport("DOCX")} disabled={exporting}>
                <Download className="mr-2 h-4 w-4" />Export DOCX
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport("JSON")} disabled={exporting}>
                <Download className="mr-2 h-4 w-4" />Export JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant={resume.status === "PUBLISHED" ? "default" : "secondary"}>{resume.status}</Badge>
          <button
            onClick={handleToggleFavorite}
            aria-label={resume.isFavorite ? "Remove from favorites" : "Add to favorites"}
            className="text-muted-foreground hover:text-amber-500 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Star className={cn("h-4 w-4", resume.isFavorite && "fill-amber-400 text-amber-400")} />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
