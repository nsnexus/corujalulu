import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { currentUser } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/env";
import { brl, STATUS_LABEL } from "@/lib/format";
import { getTheme } from "@/lib/catalog";
import { adminMarkPaid, adminRedoPage, adminRetry } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Painel admin", robots: { index: false } };

type Props = { searchParams: Promise<{ status?: string; q?: string }> };

export default async function AdminPage({ searchParams }: Props) {
  const user = await currentUser();
  if (!isAdminEmail(user?.email)) notFound();
  const { status, q } = await searchParams;
  const db = supabaseAdmin();

  // indicadores (últimos 30 dias)
  const since = new Date(Date.now() - 30 * 86400000).toISOString();
  const { data: recent } = await db.from("books").select("status,price_cents,paid_at").gte("created_at", since);
  const all = recent ?? [];
  const paid = all.filter((b) => b.paid_at);
  const revenue = paid.reduce((s, b) => s + b.price_cents, 0);
  const conv = all.length ? Math.round((paid.length / all.length) * 100) : 0;
  const failed = all.filter((b) => b.status === "failed").length;

  let query = db
    .from("books")
    .select("id,created_at,status,buyer_name,buyer_email,buyer_whatsapp,plan_id,price_cents,theme_id,title,cover_url,pages_done,pages_total,error,child")
    .order("created_at", { ascending: false })
    .limit(100);
  if (status) query = query.eq("status", status);
  if (q) query = query.or(`buyer_email.ilike.%${q.replace(/[,()%]/g, "")}%,title.ilike.%${q.replace(/[,()%]/g, "")}%`);
  const { data: books } = await query;

  const KPIS = [
    ["Prévias (30d)", String(all.length), "📝"],
    ["Vendas (30d)", String(paid.length), "🛒"],
    ["Faturamento (30d)", brl(revenue), "💰"],
    ["Conversão", `${conv}%`, "📈"],
    ["Com falha", String(failed), "⚠️"],
  ];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-10">
        <h1 className="font-display text-4xl font-extrabold">Painel administrativo</h1>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {KPIS.map(([label, value, emoji]) => (
            <div key={label} className="card p-5">
              <p className="text-sm text-ink/60">{emoji} {label}</p>
              <p className="font-display text-3xl font-extrabold text-magic-600">{value}</p>
            </div>
          ))}
        </div>

        <form className="card flex flex-wrap items-end gap-3 p-4">
          <div className="min-w-56 flex-1">
            <label className="label">Buscar (e-mail ou título)</label>
            <input name="q" defaultValue={q} className="input" />
          </div>
          <div>
            <label className="label">Status</label>
            <select name="status" defaultValue={status ?? ""} className="input">
              <option value="">Todos</option>
              {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <button className="btn-primary px-5 py-3 text-base">Filtrar</button>
        </form>

        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-magic-50 font-display text-ink/70">
              <tr>
                <th className="p-3">Livro</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Plano</th>
                <th className="p-3">Status</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {(books ?? []).map((b: any) => (
                <tr key={b.id} className="border-t border-magic-100 align-top">
                  <td className="p-3">
                    <div className="flex gap-3">
                      {b.cover_url ? <img src={b.cover_url} alt="" className="h-14 w-14 rounded-xl object-cover" /> : <div className="grid h-14 w-14 place-items-center rounded-xl bg-magic-100">📖</div>}
                      <div>
                        <Link href={`/livro/${b.id}`} target="_blank" className="font-bold text-magic-700 hover:underline">{b.title ?? `(${b.child?.name})`}</Link>
                        <p className="text-xs text-ink/50">{getTheme(b.theme_id)?.title} · {new Date(b.created_at).toLocaleString("pt-BR")}</p>
                        {b.error && <p className="mt-1 max-w-xs truncate text-xs text-coral-400" title={b.error}>⚠️ {b.error}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-semibold">{b.buyer_name}</p>
                    <p className="text-xs text-ink/60">{b.buyer_email}</p>
                    {b.buyer_whatsapp && <a className="text-xs text-green-700 underline" href={`https://wa.me/55${b.buyer_whatsapp}`} target="_blank">WhatsApp</a>}
                  </td>
                  <td className="p-3">{b.plan_id}<br /><b>{brl(b.price_cents)}</b></td>
                  <td className="p-3">
                    <span className="rounded-full bg-magic-50 px-2.5 py-1 text-xs font-bold">{STATUS_LABEL[b.status]}</span>
                    {["paid", "generating", "ready"].includes(b.status) && <p className="mt-1 text-xs">{b.pages_done}/{b.pages_total} págs.</p>}
                  </td>
                  <td className="space-y-2 p-3">
                    {["preview_ready", "awaiting_payment"].includes(b.status) && (
                      <form action={adminMarkPaid.bind(null, b.id)}><button className="text-xs font-bold text-green-700 underline">Marcar como pago</button></form>
                    )}
                    <form action={adminRetry.bind(null, b.id)}><button className="text-xs font-bold text-magic-600 underline">Reprocessar</button></form>
                    <form
                      action={async (fd: FormData) => {
                        "use server";
                        await adminRedoPage(b.id, Number(fd.get("page")));
                      }}
                      className="flex items-center gap-1"
                    >
                      <input name="page" type="number" min={0} max={b.pages_total} defaultValue={0} className="w-14 rounded-lg border border-magic-200 px-1 py-0.5 text-xs" />
                      <button className="text-xs font-bold text-ink/60 underline" title="0 = capa">Refazer imagem</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!books?.length && <p className="p-8 text-center text-ink/50">Nenhum livro encontrado.</p>}
        </div>
      </main>
    </>
  );
}
