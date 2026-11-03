import { NextResponse } from "next/server";
import { generateSpeech, type TTSVoice } from "@/lib/ai";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { fetchBook, fetchPages } from "@/lib/books";
import { isUuid } from "@/lib/format";

export const dynamic = "force-dynamic";

const VALID_VOICES: TTSVoice[] = ["nova", "fable", "alloy", "echo", "onyx", "shimmer"];

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);

  const voiceParam = searchParams.get("voice") as TTSVoice;
  const voice: TTSVoice = VALID_VOICES.includes(voiceParam) ? voiceParam : "nova";

  let textToSpeak = searchParams.get("text")?.trim();
  const pageParam = searchParams.get("page");
  const pageNumber = pageParam ? parseInt(pageParam, 10) : null;

  // Se não foi enviado texto direto, busca no banco pelo id do livro e página
  if (!textToSpeak && isUuid(id)) {
    try {
      const db = supabaseAdmin();
      if (pageNumber === null || pageNumber <= 0) {
        const book = await fetchBook(db, id);
        if (book?.title) {
          textToSpeak = `${book.title}. Uma história mágica para ${book.child.name}.`;
        }
      } else {
        const pages = await fetchPages(db, id);
        const targetPage = pages.find((p) => p.page_number === pageNumber);
        if (targetPage?.text) {
          textToSpeak = targetPage.text;
        }
      }
    } catch (e) {
      console.warn("[audio] falha ao buscar texto no banco:", (e as Error).message);
    }
  }

  if (!textToSpeak) {
    return NextResponse.json(
      { error: "Nenhum texto informado para a narração." },
      { status: 400 }
    );
  }

  try {
    const audioBytes = await generateSpeech(textToSpeak, voice);
    return new NextResponse(Buffer.from(audioBytes), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (e) {
    const msg = (e as Error).message;
    console.error("[audio] erro ao gerar áudio:", msg);
    return NextResponse.json(
      { error: msg || "Erro ao gerar narração com IA." },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: { text?: string; voice?: TTSVoice; page?: number } = {};
  try {
    body = await req.json();
  } catch {
    // vazio
  }

  const voice: TTSVoice = VALID_VOICES.includes(body.voice as TTSVoice)
    ? (body.voice as TTSVoice)
    : "nova";

  let textToSpeak = body.text?.trim();

  if (!textToSpeak && isUuid(id) && body.page !== undefined) {
    try {
      const db = supabaseAdmin();
      if (body.page <= 0) {
        const book = await fetchBook(db, id);
        if (book?.title) {
          textToSpeak = `${book.title}. Uma história para ${book.child.name}.`;
        }
      } else {
        const pages = await fetchPages(db, id);
        const targetPage = pages.find((p) => p.page_number === body.page);
        if (targetPage?.text) textToSpeak = targetPage.text;
      }
    } catch (e) {
      console.warn("[audio] falha ao buscar texto no banco:", (e as Error).message);
    }
  }

  if (!textToSpeak) {
    return NextResponse.json(
      { error: "Nenhum texto informado para a narração." },
      { status: 400 }
    );
  }

  try {
    const audioBytes = await generateSpeech(textToSpeak, voice);
    return new NextResponse(Buffer.from(audioBytes), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (e) {
    const msg = (e as Error).message;
    console.error("[audio] erro ao gerar áudio:", msg);
    return NextResponse.json(
      { error: msg || "Erro ao gerar narração com IA." },
      { status: 500 }
    );
  }
}
