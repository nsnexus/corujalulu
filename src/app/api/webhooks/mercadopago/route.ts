import { NextResponse } from "next/server";
import { getPayment, verifyWebhookSignature } from "@/lib/mercadopago";
import { markPaid } from "@/lib/books";

export const dynamic = "force-dynamic";

/**
 * Webhook do Mercado Pago (configure em Suas integrações > Webhooks > evento "Pagamentos").
 * Sempre consulta o pagamento na API antes de confiar no evento.
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  let body: any = {};
  try { body = await req.json(); } catch {}

  const type = body?.type || url.searchParams.get("type") || url.searchParams.get("topic");
  const dataId = String(body?.data?.id || url.searchParams.get("data.id") || url.searchParams.get("id") || "");
  if (type !== "payment" || !dataId) return NextResponse.json({ ignored: true });

  if (!(await verifyWebhookSignature(req, dataId))) {
    console.warn("[webhook] assinatura inválida");
    return NextResponse.json({ error: "assinatura inválida" }, { status: 401 });
  }

  try {
    const payment = await getPayment(dataId);
    if (payment.status === "approved" && payment.external_reference) {
      await markPaid(payment.external_reference, payment);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[webhook]", (e as Error).message);
    return NextResponse.json({ error: "falha" }, { status: 500 }); // MP tenta de novo
  }
}
