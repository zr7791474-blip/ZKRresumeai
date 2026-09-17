import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, FileText, Zap, Shield, Target, Download, Palette, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedContainer } from "@/components/shared/animated-container";
import { TemplatePreviewThumb } from "@/components/shared/template-preview";
import { ResumeShowcase } from "@/components/shared/resume-showcase";
import { TEMPLATES } from "@/data/templates";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          {/* Real hero asset as a full-bleed background, not a standalone card */}
          <Image
            src="/hero/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[30%_35%] -z-20"
          />
          {/* Dark scrim: stronger over the text for readability, lighter toward
              the right/bottom so the real image still reads through. */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/90 to-background/60" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/40 to-background/40" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
            <div className="max-w-2xl">
              <AnimatedContainer>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold tracking-tight leading-[1.08] text-balance">
                  Resumes built like{" "}
                  <span className="accent-text">production software</span>
                </h1>
              </AnimatedContainer>
              <AnimatedContainer delay={0.2}>
                <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
                  Structured content, ATS-tested formatting, and an AI writing assistant that
                  tightens every line — so the resume you ship is as considered as the work it describes.
                </p>
              </AnimatedContainer>
              <AnimatedContainer delay={0.3}>
                <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Button size="lg" className="h-12 px-8 text-base" asChild>
                    <Link href="/dashboard">
                      Try the Demo <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm" asChild>
                    <Link href="/templates"><FileText className="mr-2 h-4 w-4" />Browse Templates</Link>
                  </Button>
                </div>
              </AnimatedContainer>
              <AnimatedContainer delay={0.45}>
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-brand" />50 free AI credits</div>
                  <div className="flex items-center gap-1.5"><FileText className="h-4 w-4" />6 premium templates</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" />ATS optimized</div>
                </div>
              </AnimatedContainer>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-16 items-center">
              {/* Real resume example — the visual anchor, not an abstract mockup */}
              <AnimatedContainer direction="right">
                <div className="relative mx-auto max-w-sm lg:max-w-none mt-6 sm:mt-0">
                  <ResumeShowcase className="rounded-lg" />
                  <div className="absolute -top-5 -left-5 hidden sm:flex items-center gap-2.5 rounded-lg border bg-card px-3.5 py-2.5 shadow-xl">
                    <Sparkles className="h-3.5 w-3.5 text-brand shrink-0" />
                    <p className="text-xs text-muted-foreground">Written and tightened with AI, section by section</p>
                  </div>
                </div>
              </AnimatedContainer>

              {/* Major features — real headline + explanation, not icon boxes */}
              <div className="space-y-10">
                <AnimatedContainer delay={0.05}>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
                    This is what a finished resume <span className="accent-text">actually looks like</span>
                  </h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
                    Not a mockup — the structure every resume you build goes through: a real header,
                    quantified experience, and formatting that survives an ATS parser.
                  </p>
                </AnimatedContainer>

                <div className="space-y-8 border-t pt-8">
                  <AnimatedContainer delay={0.1}>
                    <h3 className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand" />AI that edits, not autopilot</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-md">
                      Generate a summary or tighten a bullet point on demand — you review and copy in what you keep, nothing gets overwritten behind your back.
                    </p>
                  </AnimatedContainer>
                  <AnimatedContainer delay={0.15}>
                    <h3 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-brand" />Section-by-section control</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-md">
                      Every section saves independently, with a confirmation before anything is deleted — so an accidental click never costs you an evening of edits.
                    </p>
                  </AnimatedContainer>
                  <AnimatedContainer delay={0.2}>
                    <h3 className="font-semibold flex items-center gap-2"><Target className="h-4 w-4 text-brand" />Built to pass ATS parsing</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-md">
                      Every template uses clean, parseable structure instead of graphics-heavy layouts that applicant tracking systems misread.
                    </p>
                  </AnimatedContainer>
                </div>

                <AnimatedContainer delay={0.25}>
                  <div className="flex flex-wrap gap-x-8 gap-y-2 border-t pt-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Palette className="h-3.5 w-3.5" />6 templates</span>
                    <span className="flex items-center gap-1.5"><Download className="h-3.5 w-3.5" />PDF, DOCX &amp; JSON export</span>
                    <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" />Encrypted, one-click delete</span>
                  </div>
                </AnimatedContainer>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimatedContainer className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Templates for every <span className="accent-text">career stage</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Pick a starting point, then let the AI tools do the heavy lifting.
              </p>
            </AnimatedContainer>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TEMPLATES.map((template, index) => (
                <AnimatedContainer key={template.id} delay={index * 0.05}>
                  <Link href={`/templates#${template.id}`} className="block h-full">
                    <Card className="overflow-hidden h-full transition-shadow hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30 group">
                      <div className="aspect-[4/3] w-full overflow-hidden border-b">
                        <TemplatePreviewThumb template={template} className="transition-transform duration-300 group-hover:scale-[1.03]" />
                      </div>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold">{template.name}</h3>
                          <Badge variant="outline" className="text-xs">{template.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedContainer>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedContainer>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Ready to build a resume that gets noticed?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Explore the client dashboard and resume builder — no account required.
              </p>
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <Link href="/dashboard">
                  Try the Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </AnimatedContainer>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
