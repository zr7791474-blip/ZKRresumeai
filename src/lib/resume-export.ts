import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import type { ResumeSectionData } from "@/types";

interface ExportableResume {
  title: string;
  data: Record<string, unknown>;
  sections: ResumeSectionData[];
}

function sectionLabel(type: string): string {
  return type
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function flattenSectionContent(content: Record<string, unknown>): string[] {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(content)) {
    if (value === null || value === undefined || value === "") continue;
    if (Array.isArray(value)) {
      lines.push(`${key}: ${value.map((v) => (typeof v === "object" ? JSON.stringify(v) : String(v))).join(", ")}`);
    } else if (typeof value === "object") {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  return lines;
}

function personalInfoLines(data: Record<string, unknown>): string[] {
  return Object.entries(data)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`);
}

export async function buildResumePdf(resume: ExportableResume): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([612, 792]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const margin = 56;
  let y = 792 - margin;
  const lineHeight = 16;

  function ensureSpace(needed: number) {
    if (y - needed < margin) {
      page = pdfDoc.addPage([612, 792]);
      y = 792 - margin;
    }
  }

  function drawText(text: string, opts: { size?: number; bold?: boolean; color?: [number, number, number] } = {}) {
    const size = opts.size ?? 11;
    const usedFont = opts.bold ? boldFont : font;
    const maxWidth = 612 - margin * 2;
    const words = text.split(" ");
    let line = "";

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const width = usedFont.widthOfTextAtSize(testLine, size);
      if (width > maxWidth && line) {
        ensureSpace(lineHeight);
        page.drawText(line, { x: margin, y, size, font: usedFont, color: opts.color ? rgb(...opts.color) : rgb(0.1, 0.1, 0.1) });
        y -= lineHeight;
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) {
      ensureSpace(lineHeight);
      page.drawText(line, { x: margin, y, size, font: usedFont, color: opts.color ? rgb(...opts.color) : rgb(0.1, 0.1, 0.1) });
      y -= lineHeight;
    }
  }

  drawText(resume.title, { size: 22, bold: true });
  y -= 6;

  const personalLines = personalInfoLines(resume.data);
  if (personalLines.length > 0) {
    drawText(personalLines.join("   |   "), { size: 10, color: [0.4, 0.4, 0.4] });
    y -= 8;
  }

  for (const section of resume.sections) {
    ensureSpace(lineHeight * 2);
    y -= 6;
    drawText(section.title || sectionLabel(section.type), { size: 13, bold: true });
    y -= 2;

    const lines = flattenSectionContent(section.content);
    if (lines.length === 0) {
      drawText("(No content yet)", { size: 10, color: [0.6, 0.6, 0.6] });
    } else {
      for (const line of lines) {
        drawText(`- ${line}`, { size: 10.5 });
      }
    }
  }

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}

export async function buildResumeDocx(resume: ExportableResume): Promise<Buffer> {
  const children: Paragraph[] = [
    new Paragraph({
      text: resume.title,
      heading: HeadingLevel.TITLE,
    }),
  ];

  const personalLines = personalInfoLines(resume.data);
  if (personalLines.length > 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: personalLines.join("  |  "), color: "666666", size: 20 })],
      })
    );
  }

  for (const section of resume.sections) {
    children.push(
      new Paragraph({
        text: section.title || sectionLabel(section.type),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 80 },
      })
    );

    const lines = flattenSectionContent(section.content);
    if (lines.length === 0) {
      children.push(new Paragraph({ children: [new TextRun({ text: "(No content yet)", italics: true })] }));
    } else {
      for (const line of lines) {
        children.push(new Paragraph({ text: line, bullet: { level: 0 } }));
      }
    }
  }

  const doc = new Document({ sections: [{ children }] });
  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}

export function buildResumeJson(resume: ExportableResume): Buffer {
  return Buffer.from(JSON.stringify({ title: resume.title, data: resume.data, sections: resume.sections }, null, 2));
}
