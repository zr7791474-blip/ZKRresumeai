"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { AnimatedContainer } from "@/components/shared/animated-container";
import { TemplatePreviewThumb } from "@/components/shared/template-preview";
import { TEMPLATES, type ResumeTemplateDef } from "@/constants";
import { useAuthStore } from "@/stores/auth.store";

const CATEGORIES = ["All", ...Array.from(new Set(TEMPLATES.map((t) => t.category)))];

export default function PublicTemplatesPage() {
  const { isAuthenticated } = useAuthStore();
  const [category, setCategory] = useState<string>("All");
  const [previewing, setPreviewing] = useState<ResumeTemplateDef | null>(null);

  const visible = category === "All" ? TEMPLATES : TEMPLATES.filter((t) => t.category === category);

  function templateActionHref(template: ResumeTemplateDef) {
    const destination = `/dashboard/templates?select=${template.id}`;
    return isAuthenticated ? destination : `/register?callbackUrl=${encodeURIComponent(destination)}`;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-20 sm:pb-16 text-center">
            <AnimatedContainer>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
                Choose a template, <span className="accent-text">start building</span>
              </h1>
            </AnimatedContainer>
            <AnimatedContainer delay={0.1}>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Every template is ATS-tested and fully editable. Preview the layout, then bring it
                into the builder when you&apos;re ready.
              </p>
            </AnimatedContainer>

            <AnimatedContainer delay={0.3}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    aria-pressed={category === c}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      category === c
                        ? "bg-brand text-brand-foreground border-brand"
                        : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </AnimatedContainer>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((template, index) => (
                <AnimatedContainer key={template.id} delay={index * 0.05}>
                  <Card id={template.id} className="overflow-hidden h-full flex flex-col scroll-mt-24 transition-shadow hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30 group">
                    <button
                      type="button"
                      onClick={() => setPreviewing(template)}
                      className="relative aspect-[4/3] w-full overflow-hidden border-b focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`Preview the ${template.name} template`}
                    >
                      <TemplatePreviewThumb template={template} className="transition-transform duration-300 group-hover:scale-[1.03]" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 text-sm font-medium text-white">
                          <Eye className="h-4 w-4" /> Preview
                        </span>
                      </div>
                    </button>
                    <CardContent className="p-5 flex flex-col flex-1 gap-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge variant="outline" className="text-xs">{template.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex-1">{template.description}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => setPreviewing(template)}>
                          <Eye className="mr-1.5 h-3.5 w-3.5" /> Preview
                        </Button>
                        <Button size="sm" className="flex-1" asChild>
                          <Link href={templateActionHref(template)}>
                            Use this <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedContainer>
              ))}
            </div>

            {visible.length === 0 && (
              <p className="text-center text-muted-foreground py-16">No templates in this category yet.</p>
            )}
          </div>
        </section>
      </main>

      <Dialog open={!!previewing} onOpenChange={(open) => !open && setPreviewing(null)}>
        <DialogContent className="sm:max-w-lg">
          {previewing && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {previewing.name}
                  <Badge variant="outline" className="text-xs font-normal">{previewing.category}</Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border">
                <TemplatePreviewThumb template={previewing} />
              </div>
              <p className="text-sm text-muted-foreground">{previewing.description}</p>
              <Button asChild className="w-full">
                <Link href={templateActionHref(previewing)}>
                  Use this template <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
              {!isAuthenticated && (
                <p className="text-xs text-center text-muted-foreground">
                  Free to start — no credit card required.
                </p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
