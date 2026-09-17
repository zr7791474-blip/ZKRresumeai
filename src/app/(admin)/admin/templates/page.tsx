import { LayoutTemplate } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplatePreviewThumb } from "@/components/shared/template-preview";
import { TEMPLATES } from "@/data/templates";

export default function AdminTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <LayoutTemplate className="h-5 w-5 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">Demo template catalog management.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <div className="aspect-[4/3] w-full overflow-hidden border-b">
              <TemplatePreviewThumb template={template} />
            </div>
            <CardContent className="p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{template.name}</h3>
                <Badge variant="outline" className="text-xs">{template.category}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{template.description}</p>
              <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                <span>Status</span>
                <Badge variant="default" className="text-[10px]">Published</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
