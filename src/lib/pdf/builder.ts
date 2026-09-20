import { jsPDF } from "jspdf";

const BLUE: [number, number, number] = [23, 92, 211];
const DEEP: [number, number, number] = [10, 35, 82];
const INK: [number, number, number] = [26, 32, 44];
const GREY: [number, number, number] = [106, 118, 138];
const LIGHT: [number, number, number] = [232, 240, 254];
const AMBER: [number, number, number] = [196, 126, 10];
const RED: [number, number, number] = [190, 44, 44];
const GREEN: [number, number, number] = [22, 128, 88];

export const COLORS = { BLUE, DEEP, INK, GREY, LIGHT, AMBER, RED, GREEN };

const MARGIN = 56;
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const CONTENT_W = PAGE_W - MARGIN * 2;

export type Report = {
  doc: jsPDF;
  cover: (opts: {
    eyebrow: string;
    title: string;
    subtitle: string;
    meta: string[];
  }) => void;
  h1: (text: string) => void;
  h2: (text: string) => void;
  p: (text: string) => void;
  small: (text: string) => void;
  bullets: (items: string[]) => void;
  numbered: (items: string[]) => void;
  kvGrid: (rows: Array<[string, string]>) => void;
  scoreBar: (label: string, value: number, note?: string) => void;
  table: (head: string[], rows: string[][], widths?: number[]) => void;
  callout: (title: string, body: string, tone?: "info" | "warn" | "risk" | "ok") => void;
  spacer: (h?: number) => void;
  newPage: () => void;
  save: (filename: string, footer: string) => void;
};

export function createReport(): Report {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  let y = MARGIN;

  const ensure = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN - 24) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const setFont = (style: "normal" | "bold", size: number, color: number[]) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
  };

  const writeLines = (
    text: string,
    size: number,
    style: "normal" | "bold",
    color: number[],
    lineHeight: number,
    indent = 0,
  ) => {
    setFont(style, size, color);
    const lines = doc.splitTextToSize(text, CONTENT_W - indent) as string[];
    for (const line of lines) {
      ensure(lineHeight);
      setFont(style, size, color);
      doc.text(line, MARGIN + indent, y + size);
      y += lineHeight;
    }
  };

  const report: Report = {
    doc,

    cover({ eyebrow, title, subtitle, meta }) {
      doc.setFillColor(DEEP[0], DEEP[1], DEEP[2]);
      doc.rect(0, 0, PAGE_W, 300, "F");
      doc.setFillColor(BLUE[0], BLUE[1], BLUE[2]);
      doc.rect(0, 292, PAGE_W, 8, "F");

      setFont("bold", 22, [255, 255, 255]);
      doc.text("LinkedTech", MARGIN, 84);
      setFont("normal", 9, [150, 185, 245]);
      doc.text("PROFILE & WEBSITE VISIBILITY", MARGIN, 102);

      setFont("bold", 10, [150, 185, 245]);
      doc.text(eyebrow.toUpperCase(), MARGIN, 168);

      setFont("bold", 30, [255, 255, 255]);
      const titleLines = doc.splitTextToSize(title, CONTENT_W) as string[];
      let ty = 200;
      for (const line of titleLines) {
        doc.text(line, MARGIN, ty);
        ty += 34;
      }

      y = 344;
      writeLines(subtitle, 12, "normal", GREY, 19);
      y += 12;

      doc.setDrawColor(LIGHT[0], LIGHT[1], LIGHT[2]);
      doc.setLineWidth(1);
      doc.line(MARGIN, y, PAGE_W - MARGIN, y);
      y += 18;

      for (const line of meta) {
        setFont("normal", 10, GREY);
        doc.text(line, MARGIN, y + 10);
        y += 18;
      }
      y += 14;
    },

    h1(text) {
      ensure(64);
      y += 10;
      doc.setFillColor(BLUE[0], BLUE[1], BLUE[2]);
      doc.rect(MARGIN, y + 2, 34, 4, "F");
      y += 16;
      writeLines(text, 19, "bold", DEEP, 26);
      y += 6;
    },

    h2(text) {
      ensure(42);
      y += 8;
      writeLines(text, 13, "bold", INK, 19);
      y += 2;
    },

    p(text) {
      writeLines(text, 10.5, "normal", INK, 16);
      y += 6;
    },

    small(text) {
      writeLines(text, 9, "normal", GREY, 13);
      y += 4;
    },

    bullets(items) {
      for (const item of items) {
        ensure(18);
        doc.setFillColor(BLUE[0], BLUE[1], BLUE[2]);
        doc.circle(MARGIN + 4, y + 7, 2.2, "F");
        writeLines(item, 10.5, "normal", INK, 15.5, 16);
        y += 3;
      }
      y += 6;
    },

    numbered(items) {
      items.forEach((item, index) => {
        ensure(18);
        setFont("bold", 10.5, BLUE);
        doc.text(`${index + 1}.`, MARGIN, y + 10);
        writeLines(item, 10.5, "normal", INK, 15.5, 20);
        y += 3;
      });
      y += 6;
    },

    kvGrid(rows) {
      const colW = CONTENT_W / 2;
      const boxH = 46;
      for (let i = 0; i < rows.length; i += 2) {
        ensure(boxH + 8);
        for (let c = 0; c < 2; c += 1) {
          const row = rows[i + c];
          if (!row) continue;
          const x = MARGIN + c * colW + (c === 1 ? 6 : 0);
          const w = colW - 6;
          doc.setFillColor(LIGHT[0], LIGHT[1], LIGHT[2]);
          doc.roundedRect(x, y, w, boxH, 6, 6, "F");
          setFont("normal", 8.5, GREY);
          doc.text(String(row[0]).toUpperCase(), x + 12, y + 18);
          setFont("bold", 14, DEEP);
          doc.text(
            (doc.splitTextToSize(row[1], w - 24) as string[])[0] ?? "",
            x + 12,
            y + 37,
          );
        }
        y += boxH + 8;
      }
      y += 4;
    },

    scoreBar(label, value, note) {
      ensure(40);
      setFont("bold", 10.5, INK);
      doc.text(label, MARGIN, y + 10);
      setFont("bold", 10.5, BLUE);
      doc.text(`${value}/100`, PAGE_W - MARGIN - 44, y + 10);
      const barY = y + 18;
      doc.setFillColor(LIGHT[0], LIGHT[1], LIGHT[2]);
      doc.roundedRect(MARGIN, barY, CONTENT_W, 9, 4.5, 4.5, "F");
      const fill =
        value >= 70 ? GREEN : value >= 50 ? BLUE : value >= 35 ? AMBER : RED;
      doc.setFillColor(fill[0], fill[1], fill[2]);
      doc.roundedRect(
        MARGIN,
        barY,
        Math.max(10, (CONTENT_W * value) / 100),
        9,
        4.5,
        4.5,
        "F",
      );
      y = barY + 16;
      if (note) {
        setFont("normal", 9, GREY);
        const lines = doc.splitTextToSize(note, CONTENT_W) as string[];
        for (const line of lines) {
          ensure(12);
          doc.text(line, MARGIN, y + 8);
          y += 12;
        }
      }
      y += 8;
    },

    table(head, rows, widths) {
      const cols = head.length;
      const colWidths =
        widths ?? new Array(cols).fill(CONTENT_W / cols);
      const rowH = 22;

      const drawHead = () => {
        ensure(rowH * 2);
        doc.setFillColor(DEEP[0], DEEP[1], DEEP[2]);
        doc.rect(MARGIN, y, CONTENT_W, rowH, "F");
        setFont("bold", 9, [255, 255, 255]);
        let x = MARGIN + 8;
        head.forEach((cell, i) => {
          doc.text(cell.toUpperCase(), x, y + 14);
          x += colWidths[i];
        });
        y += rowH;
      };

      drawHead();

      rows.forEach((row, index) => {
        const cellLines = row.map(
          (cell, i) =>
            doc.splitTextToSize(String(cell), colWidths[i] - 14) as string[],
        );
        const lineCount = Math.max(...cellLines.map((l) => l.length), 1);
        const height = 8 + lineCount * 12;
        if (y + height > PAGE_H - MARGIN - 24) {
          doc.addPage();
          y = MARGIN;
          drawHead();
        }
        if (index % 2 === 0) {
          doc.setFillColor(246, 249, 255);
          doc.rect(MARGIN, y, CONTENT_W, height, "F");
        }
        let x = MARGIN + 8;
        cellLines.forEach((lines, i) => {
          setFont(i === 0 ? "bold" : "normal", 9.5, i === 0 ? DEEP : INK);
          lines.forEach((line, li) => {
            doc.text(line, x, y + 15 + li * 12);
          });
          x += colWidths[i];
        });
        y += height;
      });

      doc.setDrawColor(LIGHT[0], LIGHT[1], LIGHT[2]);
      doc.line(MARGIN, y, PAGE_W - MARGIN, y);
      y += 16;
    },

    callout(title, body, tone = "info") {
      const tones = { info: BLUE, warn: AMBER, risk: RED, ok: GREEN };
      const accent = tones[tone];
      setFont("normal", 10, INK);
      const lines = doc.splitTextToSize(body, CONTENT_W - 34) as string[];
      const height = 34 + lines.length * 14;
      ensure(height + 10);
      doc.setFillColor(248, 250, 255);
      doc.roundedRect(MARGIN, y, CONTENT_W, height, 6, 6, "F");
      doc.setFillColor(accent[0], accent[1], accent[2]);
      doc.rect(MARGIN, y, 4, height, "F");
      setFont("bold", 10.5, accent);
      doc.text(title, MARGIN + 16, y + 20);
      setFont("normal", 10, INK);
      lines.forEach((line, i) => {
        doc.text(line, MARGIN + 16, y + 38 + i * 14);
      });
      y += height + 14;
    },

    spacer(h = 12) {
      y += h;
    },

    newPage() {
      doc.addPage();
      y = MARGIN;
    },

    save(filename, footer) {
      const pages = doc.getNumberOfPages();
      for (let page = 1; page <= pages; page += 1) {
        doc.setPage(page);
        if (page === 1) continue;
        doc.setDrawColor(LIGHT[0], LIGHT[1], LIGHT[2]);
        doc.setLineWidth(0.8);
        doc.line(MARGIN, PAGE_H - 44, PAGE_W - MARGIN, PAGE_H - 44);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(GREY[0], GREY[1], GREY[2]);
        doc.text(footer, MARGIN, PAGE_H - 30);
        doc.text(`${page} / ${pages}`, PAGE_W - MARGIN - 30, PAGE_H - 30);
      }
      doc.save(filename);
    },
  };

  return report;
}
