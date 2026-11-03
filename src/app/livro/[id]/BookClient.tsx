"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import FlipBook, { type ReaderPage } from "@/components/FlipBook";
import { buildBookPdf } from "@/lib/pdf-client";
import { BRAND } from "@/lib/catalog";
import { brl } from "@/lib/format";
import type { BookStatus, StepResult } from "@/lib/types";

export interface BookView {
  id: string;
  status: BookStatus;
  title: string | null;
  synopsis: string | null;
  childName: string;
  dedication: string | null;
  coverUrl: string | null;
  coverFailed: boolean;
  planName: string;
  priceCents: number;
  pagesTotal: number;
  pagesDone: number;
  error: string | null;
  pages: { n: number; text: string; image: string | null; status: string }[];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const PRE_PAY: BookStatus[] = ["preview_ready", "awaiting_payment"];
const PAID: BookStatus[] = ["paid", "generating"];

export default function BookClient({ book }: { book: BookView }) {
  const router = useRouter();
  const params = useSearchParams();
  const payReturn = params.get("pagamento");

  const [live, setLive] = useState<StepResult>({
    status: book.status,
    coverUrl: book.coverUrl,
    pagesDone: book.pagesDone,
    pagesTotal: book.pagesTotal,
  });
  const [paying, setPaying] = useState(false);
  const [msg, setMsg] = useState("");
  const [pdfBusy, setPdfBusy] = useState(false);
  const [kick, setKick] = useState(0);
  const running = useRef(false);

  // ------------------------------------------------------------------
  // Motor: chama /step em loop enquanto houver trabalho (capa, pagamento, páginas)
  // ------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    const needsWork = (s: StepResult) =>
      (!s.coverUrl && !book.coverFailed && [...PRE_PAY, ...PAID].includes(s.status)) ||
      PAID.includes(s.status) ||
      (s.status === "awaiting_payment" && payReturn === "ok");

    async function loop() {
      if (running.current) return;
      running.current = true;
      let state = live;
      let payChecks = 0;
      let failures = 0;
      try {
        while (!cancelled && needsWork(state)) {
          const res = await fetch(`/api/books/${book.id}/step`, { method: "POST" });
          if (!res.ok) {
            if (++failures >= 4) { setMsg("Tivemos um probleminha. Recarregue a página para continuar."); break; }
            await sleep(4000);
            continue;
          }
          failures = 0;
          const next: StepResult = await res.json();
          const progressed = next.coverUrl !== state.coverUrl || next.pagesDone !== state.pagesDone || next.status !== state.status;
          state = next;
          setLive(next);
          if (progressed) router.refresh();
          if (next.busy) await sleep(4000);
          else if (next.status === "awaiting_payment") {
            if (++payChecks > 40) { setMsg("Ainda não recebemos a confirmação. Se pagou via Pix, aguarde alguns minutos e recarregue."); break; }
            await sleep(5000);
          } else if (!progressed) await sleep(2500);
          if (!next.coverUrl && next.error && PRE_PAY.includes(next.status) && !next.busy) await sleep(3000);
        }
      } finally {
        running.current = false;
      }
    }
    loop();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.id, kick, payReturn]);

  async function pay() {
    setPaying(true);
    setMsg("");
    try {
      const res = await fetch(`/api/books/${book.id}/checkout`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      window.location.href = json.url;
    } catch (e) {
      setMsg((e as Error).message || "Não foi possível abrir o pagamento.");
      setPaying(false);
    }
  }

  async function downloadPdf() {
    setPdfBusy(true);
    try {
      const blob = await buildBookPdf({
        title: book.title ?? "Meu livro",
        childName: book.childName,
        dedication: book.dedication,
        coverUrl: live.coverUrl ?? book.coverUrl,
        pages: book.pages.map((p) => ({ text: p.text, imageUrl: p.image })),
        brand: BRAND.name,
      });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${(book.title ?? "livro").replace(/[^\p{L}\p{N} ]/gu, "").trim().replace(/\s+/g, "-")}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    } finally {
      setPdfBusy(false);
    }
  }

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/livro/${book.id}` : "";
  const status = live.status;
  const cover = live.coverUrl ?? book.coverUrl;

  // ================================================================== FALHA
  if (status === "failed" || status === "draft") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="text-7xl">🌧️</div>
        <h1 className="mt-4 font-display text-3xl font-extrabold">Ops! A história não saiu como esperado</h1>
        <p className="mt-2 text-ink/60">Nossa equipe foi avisada. Você pode tentar criar novamente — seus dados ficaram salvos.</p>
        <Link href="/criar" className="btn-primary mt-8">Tentar de novo</Link>
      </div>
    );
  }

  // ================================================================== PRONTO
  if (status === "ready") {
    const readerPages: ReaderPage[] = [
      { kind: "cover", image: cover, title: book.title ?? "" },
      ...(book.dedication ? [{ kind: "dedication" as const, text: book.dedication }] : []),
      ...book.pages.map((p) => ({ kind: "page" as const, image: p.image, text: p.text, number: p.n })),
      { kind: "end" },
    ];
    const waText = encodeURIComponent(`📖✨ Olha que lindo o livro "${book.title}" feito especialmente para ${book.childName}! ${shareUrl}`);
    return (
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <header className="text-center">
          <p className="font-display font-bold text-magic-600">🎉 Seu livro mágico está pronto!</p>
          <h1 className="font-display text-3xl font-extrabold md:text-5xl">{book.title}</h1>
        </header>
        <FlipBook pages={readerPages} childName={book.childName} bookId={book.id} />
        <div className="card flex flex-wrap items-center justify-center gap-3 p-6">
          <button onClick={downloadPdf} disabled={pdfBusy} className="btn-primary">{pdfBusy ? "Gerando PDF…" : "⬇️ Baixar PDF"}</button>
          <a href={`https://wa.me/?text=${waText}`} target="_blank" rel="noopener" className="btn-sun">💬 Enviar no WhatsApp</a>
          <button onClick={() => { navigator.clipboard.writeText(shareUrl); setMsg("Link copiado! ✨"); }} className="btn-ghost">🔗 Copiar link</button>
          <Link href="/criar" className="btn-ghost">✨ Criar outro livro</Link>
          {msg && <p className="w-full text-center font-semibold text-magic-600">{msg}</p>}
        </div>
      </div>
    );
  }

  // ================================================================== ILUSTRANDO
  if (PAID.includes(status)) {
    const pct = Math.round((live.pagesDone / Math.max(1, live.pagesTotal)) * 100);
    return (
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
        <div className="card space-y-4 p-8 text-center">
          <p className="font-display text-lg font-bold text-magic-600">💜 Pagamento confirmado!</p>
          <h1 className="font-display text-3xl font-extrabold">Ilustrando o livro de {book.childName}…</h1>
          <div className="mx-auto h-4 max-w-md overflow-hidden rounded-full bg-magic-100">
            <div className="h-full rounded-full bg-gradient-to-r from-magic-500 to-sun-400 transition-all duration-700" style={{ width: `${Math.max(4, pct)}%` }} />
          </div>
          <p className="font-semibold">{live.pagesDone} de {live.pagesTotal} páginas · {pct}%</p>
          <p className="text-sm text-ink/60">
            Cada ilustração leva cerca de 30–60 segundos. Pode deixar esta página aberta — se fechar, continuamos quando você voltar.
          </p>
          {msg && <p className="font-semibold text-coral-400">{msg} <button className="underline" onClick={() => { setMsg(""); setKick((k) => k + 1); }}>Tentar agora</button></p>}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {cover && <img src={cover} alt="Capa" className="aspect-square w-full rounded-2xl object-cover shadow-md ring-4 ring-sun-300" />}
          {book.pages.map((p) =>
            p.image ? (
              <img key={p.n} src={p.image} alt={`Página ${p.n}`} className="aspect-square w-full animate-page-in rounded-2xl object-cover shadow-md" />
            ) : (
              <div key={p.n} className="grid aspect-square place-items-center rounded-2xl bg-magic-100 text-center text-sm font-semibold text-magic-600">
                <span><span className="block animate-twinkle text-3xl">✨</span>Página {p.n}</span>
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  // ================================================================== PRÉVIA (antes do pagamento)
  const waiting = status === "awaiting_payment" && payReturn === "ok";
  return (
    <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-10 lg:grid-cols-[1.1fr_1fr]">
      {/* capa */}
      <div className="relative overflow-hidden rounded-[2rem] bg-magic-900 shadow-2xl">
        {cover ? (
          <img src={cover} alt="Capa do livro" className="aspect-square w-full animate-page-in object-cover" />
        ) : (
          <div className="grid aspect-square place-items-center p-10 text-center text-white">
            {book.coverFailed ? (
              <p>A capa será ilustrada junto com as páginas 🎨</p>
            ) : (
              <div className="space-y-3">
                <div className="animate-float text-7xl">🎨</div>
                <p className="font-display text-xl font-bold">Pintando a capa…</p>
                <p className="text-sm text-white/60">Leva cerca de 1 minuto</p>
              </div>
            )}
          </div>
        )}
        <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/60 to-transparent p-6 pb-16">
          <h1 className="font-display text-3xl font-extrabold text-white drop-shadow md:text-4xl">{book.title}</h1>
        </div>
      </div>

      {/* detalhes + CTA */}
      <div className="space-y-6">
        <div>
          <p className="font-display font-bold text-magic-600">✨ Prévia grátis</p>
          <h2 className="font-display text-3xl font-extrabold">A história de {book.childName} está pronta!</h2>
          <p className="mt-2 text-lg text-ink/70">{book.synopsis}</p>
        </div>

        {book.pages[0] && (
          <div className="card p-6">
            <p className="mb-2 text-sm font-bold text-magic-500">Página 1</p>
            <p className="font-display text-xl leading-relaxed">{book.pages[0].text}</p>
          </div>
        )}

        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: Math.min(10, book.pagesTotal - 1) }).map((_, k) => (
            <div key={k} className="grid aspect-[3/4] place-items-center rounded-xl bg-gradient-to-br from-magic-200 to-magic-100 text-xl blur-[1px]">🔒</div>
          ))}
        </div>
        <p className="text-sm text-ink/60">+ {book.pagesTotal - 1} páginas ilustradas esperando para ganhar vida.</p>

        <div className="card space-y-3 p-6">
          {waiting ? (
            <div className="space-y-2 text-center">
              <div className="animate-float text-5xl">⏳</div>
              <p className="font-display text-xl font-bold">Confirmando seu pagamento…</p>
              <p className="text-sm text-ink/60">Pix costuma confirmar em segundos. Não feche esta página.</p>
            </div>
          ) : (
            <>
              <div className="flex items-end justify-between">
                <span className="font-display text-lg font-bold">{book.planName}</span>
                <span className="font-display text-3xl font-extrabold text-magic-600">{brl(book.priceCents)}</span>
              </div>
              <button onClick={pay} disabled={paying} className="btn-sun w-full">
                {paying ? "Abrindo pagamento…" : "🔓 Liberar meu livro completo"}
              </button>
              <p className="text-center text-xs text-ink/50">Pix, cartão em até 12x ou boleto · Mercado Pago</p>
              {status === "awaiting_payment" && (
                <p className="text-center text-sm text-ink/60">
                  Já pagou? <button className="font-bold text-magic-600 underline" onClick={() => router.replace(`/livro/${book.id}?pagamento=ok`)}>Verificar pagamento</button>
                </p>
              )}
            </>
          )}
          {payReturn === "erro" && !waiting && <p className="text-center font-semibold text-coral-400">O pagamento não foi concluído. Tente novamente.</p>}
          {msg && <p className="text-center font-semibold text-coral-400">{msg}</p>}
        </div>
        <p className="text-center text-sm text-ink/50">🔗 Guarde este link: ele é o endereço do seu livro.</p>
      </div>
    </div>
  );
}
