import { NextResponse } from "next/server";
import { startCheckout } from "@/lib/books";
import { isUuid } from "@/lib/format";

export const dynamic = "force-dynamic";

/** POST /api/books/:id/checkout — cria a preferência no Mercado Pago e devolve a URL. */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: "id inválido" }, { status: 400 });
  try {
    return NextResponse.json({ url: await startCheckout(id) });
  } catch (e) {
    console.error("[checkout]", (e as Error).message);
    return NextResponse.json({ error: "Não foi possível iniciar o pagamento. Tente novamente." }, { status: 400 });
  }
}
