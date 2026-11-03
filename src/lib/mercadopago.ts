import "server-only";
import { env, siteUrl } from "@/lib/env";
import { getPlan, BRAND } from "@/lib/catalog";
import type { BookRow } from "@/lib/types";

const MP = "https://api.mercadopago.com";
const headers = () => ({
  Authorization: `Bearer ${env("MP_ACCESS_TOKEN")}`,
  "Content-Type": "application/json",
});

export interface MPPayment {
  id: number;
  status: string; // approved | pending | in_process | rejected | refunded | cancelled
  status_detail: string;
  external_reference: string | null;
  transaction_amount: number;
  payment_method_id: string;
  payment_type_id: string;
  date_approved: string | null;
}

/** Cria a preferência do Checkout Pro (Pix, cartão em até 12x, boleto). */
export async function createPreference(book: BookRow): Promise<{ id: string; url: string }> {
  const plan = getPlan(book.plan_id)!;
  const base = siteUrl();
  const back = (s: string) => `${base}/livro/${book.id}?pagamento=${s}`;

  const res = await fetch(`${MP}/checkout/preferences`, {
    method: "POST",
    headers: { ...headers(), "X-Idempotency-Key": `pref-${book.id}-${Date.now()}` },
    body: JSON.stringify({
      items: [
        {
          id: plan.id,
          title: `${plan.name} — ${book.title ?? "Livro personalizado"}`.slice(0, 250),
          description: `${BRAND.name}: livro digital personalizado`,
          category_id: "learnings",
          quantity: 1,
          currency_id: "BRL",
          unit_price: book.price_cents / 100,
        },
      ],
      payer: { name: book.buyer_name, email: book.buyer_email },
      external_reference: book.id,
      back_urls: { success: back("ok"), pending: back("pendente"), failure: back("erro") },
      auto_return: "approved",
      notification_url: `${base}/api/webhooks/mercadopago`,
      statement_descriptor: "ERAUMAVEZEU",
      payment_methods: { installments: 12 },
      metadata: { book_id: book.id },
    }),
  });
  if (!res.ok) throw new Error(`Mercado Pago ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const pref = (await res.json()) as { id: string; init_point: string };
  return { id: pref.id, url: pref.init_point };
}

export async function getPayment(id: string): Promise<MPPayment> {
  const res = await fetch(`${MP}/v1/payments/${encodeURIComponent(id)}`, { headers: headers() });
  if (!res.ok) throw new Error(`Mercado Pago payment ${res.status}`);
  return res.json();
}

/** Busca pagamentos aprovados de um livro (fallback caso o webhook atrase). */
export async function findApprovedPayment(bookId: string): Promise<MPPayment | null> {
  const url = `${MP}/v1/payments/search?external_reference=${encodeURIComponent(bookId)}&sort=date_created&criteria=desc&limit=10`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) return null;
  const data = (await res.json()) as { results: MPPayment[] };
  return data.results.find((p) => p.status === "approved") ?? null;
}

/**
 * Valida a assinatura do webhook (header x-signature).
 * Manifesto oficial: id:{data.id};request-id:{x-request-id};ts:{ts};
 */
export async function verifyWebhookSignature(req: Request, dataId: string): Promise<boolean> {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return false;

  const sig = req.headers.get("x-signature") || "";
  const requestId = req.headers.get("x-request-id") || "";
  const parts = Object.fromEntries(
    sig.split(",").map((p) => p.split("=").map((s) => s.trim()) as [string, string])
  );
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const id = /^[a-z0-9]+$/i.test(dataId) ? dataId.toLowerCase() : dataId;
  let manifest = `id:${id};`;
  if (requestId) manifest += `request-id:${requestId};`;
  manifest += `ts:${ts};`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(manifest));
  const hex = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");

  // comparação em tempo constante
  if (hex.length !== v1.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ v1.charCodeAt(i);
  return diff === 0;
}
