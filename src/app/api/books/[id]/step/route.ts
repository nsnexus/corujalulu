import { NextResponse } from "next/server";
import { runStep } from "@/lib/books";
import { isUuid } from "@/lib/format";

export const dynamic = "force-dynamic";

/** POST /api/books/:id/step — gera a próxima imagem pendente (capa ou página). */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: "id inválido" }, { status: 400 });
  try {
    return NextResponse.json(await runStep(id));
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json({ error: msg }, { status: msg === "NOT_FOUND" ? 404 : 500 });
  }
}
