"use client";
/**
 * Gera o PDF do livro NO NAVEGADOR (não consome CPU do Worker).
 * Layout 2:1 — ilustração quadrada à esquerda e texto à direita.
 */
export interface PdfBook {
  title: string;
  childName: string;
  dedication?: string | null;
  coverUrl: string | null;
  pages: { text: string; imageUrl: string | null }[];
  brand: string;
}

// Helvetica padrão usa WinAnsi: remove caracteres fora (emojis etc.)
const safe = (s: string) =>
  s.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, "-")
   .replace(/\u2026/g, "...").replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\u00FF]/g, "");

export async function buildBookPdf(book: PdfBook): Promise<Blob> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  pdf.setTitle(safe(book.title));
  pdf.setAuthor(book.brand);

  const W = 1200, H = 600;
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const cream = rgb(1, 0.976, 0.94);
  const ink = rgb(0.17, 0.12, 0.3);
  const violet = rgb(0.43, 0.16, 0.85);

  const embed = async (url: string | null) => {
    if (!url) return null;
    try {
      const bytes = new Uint8Array(await (await fetch(url)).arrayBuffer());
      const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;
      return isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    } catch {
      return null;
    }
  };

  const wrap = (text: string, f: typeof font, size: number, maxW: number) => {
    const lines: string[] = [];
    for (const para of safe(text).split(/\n+/)) {
      let line = "";
      for (const word of para.split(/\s+/)) {
        const test = line ? `${line} ${word}` : word;
        if (f.widthOfTextAtSize(test, size) > maxW && line) {
          lines.push(line);
          line = word;
        } else line = test;
      }
      if (line) lines.push(line);
      lines.push("");
    }
    return lines;
  };

  const drawCentered = (p: any, text: string, f: typeof font, size: number, x0: number, w: number, top: number, color = ink) => {
    const lines = wrap(text, f, size, w).filter(Boolean);
    const lh = size * 1.35;
    let y = top;
    for (const l of lines) {
      p.drawText(l, { x: x0 + (w - f.widthOfTextAtSize(l, size)) / 2, y, size, font: f, color });
      y -= lh;
    }
    return y;
  };

  // ---- CAPA ----
  {
    const p = pdf.addPage([W, H]);
    p.drawRectangle({ x: 0, y: 0, width: W, height: H, color: cream });
    const img = await embed(book.coverUrl);
    if (img) p.drawImage(img, { x: 0, y: 0, width: H, height: H });
    p.drawRectangle({ x: H, y: 0, width: W - H, height: H, color: rgb(0.22, 0.1, 0.45) });
    const after = drawCentered(p, book.title, bold, 40, H + 50, W - H - 100, H - 180, rgb(1, 1, 1));
    drawCentered(p, `Uma história feita especialmente para ${book.childName}`, font, 18, H + 50, W - H - 100, after - 20, rgb(1, 0.85, 0.45));
    drawCentered(p, book.brand, bold, 14, H + 50, W - H - 100, 50, rgb(1, 1, 1));
  }

  // ---- DEDICATÓRIA ----
  if (book.dedication) {
    const p = pdf.addPage([W, H]);
    p.drawRectangle({ x: 0, y: 0, width: W, height: H, color: cream });
    drawCentered(p, "Dedicatória", bold, 28, 200, W - 400, H - 170, violet);
    drawCentered(p, book.dedication, font, 22, 200, W - 400, H - 240);
  }

  // ---- PÁGINAS ----
  for (let i = 0; i < book.pages.length; i++) {
    const pg = book.pages[i];
    const p = pdf.addPage([W, H]);
    p.drawRectangle({ x: 0, y: 0, width: W, height: H, color: cream });
    const img = await embed(pg.imageUrl);
    if (img) p.drawImage(img, { x: 0, y: 0, width: H, height: H });

    const size = pg.text.length > 600 ? 17 : pg.text.length > 350 ? 20 : 24;
    const lines = wrap(pg.text, font, size, W - H - 110);
    const lh = size * 1.45;
    let y = H / 2 + (lines.length * lh) / 2;
    for (const l of lines) {
      if (l) p.drawText(l, { x: H + 55, y, size, font, color: ink });
      y -= l ? lh : lh * 0.4;
    }
    p.drawText(String(i + 1), { x: W - 50, y: 28, size: 14, font: bold, color: violet });
  }

  // ---- FIM ----
  {
    const p = pdf.addPage([W, H]);
    p.drawRectangle({ x: 0, y: 0, width: W, height: H, color: rgb(0.22, 0.1, 0.45) });
    drawCentered(p, "Fim", bold, 64, 0, W, H / 2 + 40, rgb(1, 0.85, 0.45));
    drawCentered(p, `E ${book.childName} viveu muitas outras aventuras...`, font, 22, 0, W, H / 2 - 30, rgb(1, 1, 1));
  }

  const bytes = await pdf.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}
