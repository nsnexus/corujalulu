import { NextResponse } from "next/server";
import { parseBookInput } from "@/lib/validate";
import { createBook } from "@/lib/books";
import { currentUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const MAX_PHOTO = 6 * 1024 * 1024;
const MIMES = ["image/jpeg", "image/png", "image/webp"];

/** POST /api/books — cria o livro (multipart: data=JSON, photo=arquivo opcional) */
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const input = parseBookInput(JSON.parse(String(form.get("data") ?? "{}")));

    let photo: { bytes: Uint8Array; mime: string } | null = null;
    const file = form.get("photo");
    if (file && typeof file !== "string" && file.size > 0) {
      if (!MIMES.includes(file.type)) throw new Error("Foto deve ser JPG, PNG ou WEBP.");
      if (file.size > MAX_PHOTO) throw new Error("Foto muito grande (máx. 6 MB).");
      if (!input.photoConsent) throw new Error("Autorize o uso da foto para continuar.");
      photo = { bytes: new Uint8Array(await file.arrayBuffer()), mime: file.type };
    }

    const user = await currentUser().catch(() => null);
    const id = await createBook(input, photo, user?.id ?? null);
    return NextResponse.json({ id });
  } catch (e) {
    const msg = (e as Error).message || "Erro inesperado.";
    const limited = msg.startsWith("LIMIT:");
    console.error("[api/books]", msg);
    return NextResponse.json(
      { error: limited ? msg.replace("LIMIT: ", "") : msg.startsWith("OpenAI") ? "Nossa fábrica de histórias está ocupada. Tente de novo em instantes." : msg },
      { status: limited ? 429 : 400 }
    );
  }
}
