import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TemplatePreviewThumb } from "@/components/shared/template-preview";
import { TEMPLATES, getTemplateById } from "@/data/templates";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ id: t.id }));
}

export default async function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = getTemplateById(id);
  if (!template) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
          <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
            <Link href="/templates"><ArrowLeft className="mr-1.5 h-3.5 w-3.5" />Back to templates</Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border shadow-sm">
              <TemplatePreviewThumb template={template} />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">{template.category}</Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{template.name}</h1>
              <p className="mt-4 text-muted-foreground leading-relaxed">{template.longDescription}</p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild>
                  <Link href={`/dashboard/templates?select=${template.id}`}>
                    Use this template <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/templates">Browse other templates</Link>
                </Button>
              </div>

              <p className="mt-6 text-xs text-muted-foreground">
                Free to try — this is a demo, no account required.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
