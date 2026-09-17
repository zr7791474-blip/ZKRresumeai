"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { TEMPLATES } from "@/data/templates";
import { useResumesActions } from "@/hooks/use-resumes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { TemplatePreviewThumb } from "@/components/shared/template-preview";

export default function TemplatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { createResume } = useResumesActions();
  const [selected, setSelected] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  const selectedTemplate = TEMPLATES.find((t) => t.id === selected);

  // Arriving from the public /templates gallery (?select=id) — pick up right
  // where the visitor left off instead of making them find the template again.
  useEffect(() => {
    const preselect = searchParams.get("select");
    const match = TEMPLATES.find((t) => t.id === preselect);
    if (match) {
      setSelected(match.id);
      setTitle(`${match.name} Resume`);
    }
    // Only needs to run once, on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCreate() {
    if (!selectedTemplate || !title.trim()) return;
    const resume = createResume({ title: title.trim(), templateId: selectedTemplate.id });
    toast({ title: "Resume created", description: `Using the ${selectedTemplate.name} template.` });
    router.push(`/dashboard/resumes/${resume.id}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
        <p className="text-sm text-muted-foreground mt-1">Pick a starting point for your next resume.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((template) => (
          <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow group">
            <div className="aspect-[4/3] w-full overflow-hidden border-b">
              <TemplatePreviewThumb template={template} />
            </div>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{template.name}</h3>
                <Badge variant="outline" className="text-xs">{template.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{template.description}</p>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  setSelected(template.id);
                  setTitle(`${template.name} Resume`);
                }}
              >
                Use this template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              {selectedTemplate?.name} Template
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="template-resume-title">Resume title</Label>
            <Input
              id="template-resume-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!title.trim()}>
              Create Resume
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
