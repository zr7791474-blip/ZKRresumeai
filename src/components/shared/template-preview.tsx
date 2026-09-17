import { cn } from "@/lib/utils";
import type { ResumeTemplateDef } from "@/data/templates";

/**
 * There is no per-template rendered layout in the app yet (a resume's visual
 * template is currently just an id + accent color). Rather than faking a
 * screenshot of a design that doesn't exist, this renders a small, honest
 * preview with real (fictional) resume content laid out in each template's
 * actual layout family — a sidebar for the bold/creative template, a
 * centered masthead for the classic one, a dense single column for the
 * traditional ones, generous whitespace for minimal. The name/title read as
 * real text; supporting lines stay muted, the way a resume actually looks
 * at thumbnail scale.
 */

type Layout = "sidebar" | "centered" | "dense" | "spacious" | "bold-header";

const LAYOUT_BY_ID: Record<string, Layout> = {
  modern: "bold-header",
  corporate: "dense",
  elegant: "centered",
  creative: "sidebar",
  executive: "dense",
  minimal: "spacious",
};

const CONTENT_BY_ID: Record<string, { name: string; title: string; role: string }> = {
  modern: { name: "Jordan Blake", title: "Marketing Manager", role: "Growth Lead, Fenwick Co." },
  corporate: { name: "Sarah Chen", title: "Business Analyst", role: "Senior Analyst, Delta Group" },
  elegant: { name: "David Martinez", title: "UX Researcher", role: "Lead Researcher, Loop Inc." },
  creative: { name: "Priya Nair", title: "Graphic Designer", role: "Art Director, Studio Vane" },
  executive: { name: "Michael Foster", title: "VP of Operations", role: "COO, Harrow Logistics" },
  minimal: { name: "Emma Wright", title: "Software Engineer", role: "Backend Lead, Cursive" },
};

function Lines({ count, className }: { count: number; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-1.5 rounded-full bg-current opacity-[0.14]"
          style={{ width: `${85 - i * 14}%` }}
        />
      ))}
    </div>
  );
}

export function TemplatePreviewThumb({
  template,
  className,
}: {
  template: ResumeTemplateDef;
  className?: string;
}) {
  const layout = LAYOUT_BY_ID[template.id] ?? "dense";
  const content = CONTENT_BY_ID[template.id] ?? { name: "Alex Rivera", title: "Professional", role: "" };

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-white text-slate-900",
        className
      )}
      aria-hidden="true"
    >
      {layout === "sidebar" && (
        <div className="flex h-full">
          <div className={cn("w-[36%] bg-gradient-to-b p-3 flex flex-col gap-3 text-white", template.accent)}>
            <div className="h-6 w-6 rounded-full bg-white/70" />
            <div>
              <p className="text-[9px] font-bold leading-tight">{content.name}</p>
              <p className="text-[7px] opacity-80 leading-tight mt-0.5">{content.title}</p>
            </div>
            <Lines count={3} className="[&>div]:opacity-40" />
          </div>
          <div className="flex-1 p-3 flex flex-col gap-2.5">
            <p className="text-[7px] font-bold uppercase tracking-wide text-slate-400">Experience</p>
            <p className="text-[8px] font-semibold text-slate-700 -mt-1.5">{content.role}</p>
            <Lines count={4} />
            <Lines count={2} className="mt-0.5" />
          </div>
        </div>
      )}

      {layout === "centered" && (
        <div className="h-full p-4 flex flex-col items-center gap-2 text-center">
          <p className="text-[10px] font-bold text-slate-900">{content.name}</p>
          <p className="text-[7.5px] text-slate-500 -mt-1">{content.title}</p>
          <div className={cn("h-[2px] w-1/3 bg-gradient-to-r", template.accent)} />
          <div className="w-full flex flex-col items-center gap-1.5 mt-1">
            {[92, 78, 85, 64].map((w, i) => (
              <div key={i} className="h-1.5 rounded-full bg-current opacity-[0.14]" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      )}

      {layout === "dense" && (
        <div className="h-full p-3.5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-900 leading-tight">{content.name}</p>
              <p className="text-[7.5px] text-slate-500 leading-tight">{content.title}</p>
            </div>
            <div className={cn("h-2.5 w-2.5 rounded-sm bg-gradient-to-br shrink-0", template.accent)} />
          </div>
          <div className="h-px w-full bg-slate-900/10" />
          <p className="text-[7px] font-bold uppercase tracking-wide text-slate-400">Experience</p>
          <p className="text-[7.5px] font-medium text-slate-600 -mt-1">{content.role}</p>
          <Lines count={3} />
        </div>
      )}

      {layout === "spacious" && (
        <div className="h-full p-4 flex flex-col gap-3 justify-center">
          <div>
            <p className="text-[10px] font-semibold text-slate-900">{content.name}</p>
            <p className="text-[7.5px] text-slate-500 mt-0.5">{content.title}</p>
          </div>
          <Lines count={2} />
          <Lines count={2} className="mt-2" />
        </div>
      )}

      {layout === "bold-header" && (
        <div className="h-full flex flex-col">
          <div className={cn("h-[32%] bg-gradient-to-br p-3 flex flex-col justify-end gap-0.5", template.accent)}>
            <p className="text-[10px] font-bold text-white leading-tight">{content.name}</p>
            <p className="text-[7.5px] text-white/80 leading-tight">{content.title}</p>
          </div>
          <div className="flex-1 p-3 flex flex-col gap-2">
            <p className="text-[7px] font-bold uppercase tracking-wide text-slate-400">Experience</p>
            <p className="text-[7.5px] font-medium text-slate-600 -mt-1">{content.role}</p>
            <Lines count={3} />
          </div>
        </div>
      )}
    </div>
  );
}
