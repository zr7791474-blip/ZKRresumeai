"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SectionType } from "@/types";
import { editorKindForType, type SectionEntry } from "@/components/resume/section-editor-kind";

interface SectionContentEditorProps {
  type: SectionType;
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

export function SectionContentEditor({ type, content, onChange }: SectionContentEditorProps) {
  const kind = editorKindForType(type);

  if (kind === "text") {
    const text = typeof content.text === "string" ? content.text : "";
    return (
      <Textarea
        value={text}
        onChange={(e) => onChange({ ...content, text: e.target.value })}
        placeholder="Write a short summary highlighting your experience and strengths..."
        rows={5}
      />
    );
  }

  if (kind === "list") {
    return <ListEditor items={Array.isArray(content.items) ? (content.items as string[]) : []} onChange={(items) => onChange({ ...content, items })} />;
  }

  return (
    <EntriesEditor entries={Array.isArray(content.entries) ? (content.entries as SectionEntry[]) : []} onChange={(entries) => onChange({ ...content, entries })} />
  );
}

function ListEditor({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  const [draft, setDraft] = useState("");

  function addItem() {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value]);
    setDraft("");
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder="Add an item and press Enter"
        />
        <Button type="button" variant="outline" onClick={addItem}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Badge key={`${item}-${index}`} variant="secondary" className="gap-1.5 pr-1">
              {item}
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                className="hover:text-destructive rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                aria-label={`Remove ${item}`}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function EntriesEditor({ entries, onChange }: { entries: SectionEntry[]; onChange: (entries: SectionEntry[]) => void }) {
  function updateEntry(index: number, patch: Partial<SectionEntry>) {
    onChange(entries.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));
  }

  function removeEntry(index: number) {
    onChange(entries.filter((_, i) => i !== index));
  }

  function addEntry() {
    onChange([...entries, { title: "", subtitle: "", period: "", description: "" }]);
  }

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <div key={index} className="rounded-lg border p-4 space-y-3 relative bg-muted/20">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <GripVertical className="h-3.5 w-3.5" />Entry {index + 1}
            </span>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeEntry(index)} aria-label="Remove entry">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder="Title (e.g. Senior Engineer)" value={entry.title} onChange={(e) => updateEntry(index, { title: e.target.value })} />
            <Input placeholder="Organization" value={entry.subtitle ?? ""} onChange={(e) => updateEntry(index, { subtitle: e.target.value })} />
          </div>
          <Input placeholder="Period (e.g. Jan 2022 - Present)" value={entry.period ?? ""} onChange={(e) => updateEntry(index, { period: e.target.value })} />
          <Textarea
            placeholder="Description, achievements, and impact..."
            value={entry.description ?? ""}
            onChange={(e) => updateEntry(index, { description: e.target.value })}
            rows={3}
          />
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addEntry} className="w-full">
        <Plus className="mr-2 h-4 w-4" />Add Entry
      </Button>
    </div>
  );
}
