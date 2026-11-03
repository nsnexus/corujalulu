import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { supabaseServer } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/env";
import { STATUS_LABEL } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Minha estante" };

export default async function EstantePage() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/entrar");

  // RLS garante que só voltam os livros deste usuário
  const { data: books } = await sb
    .from("books")
    .select("id,title,status,cover_url,created_at,child")
    .order("created_at", { ascending: false });

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[80vh] max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-extrabold">Minha estante 📚</h1>
            <p className="text-ink/60">{user.email}</p>
          </div>
          <div className="flex gap-2">
            {isAdminEmail(user.email) && <Link href="/admin" className="btn-ghost">Painel admin</Link>}
            <form action="/auth/sair" method="post"><button className="btn-ghost">Sair</button></form>
          </div>
        </div>

        {!books?.length ? (
          <div className="card p-12 text-center">
            <div className="text-6xl">🌟</div>
            <p className="mt-3 text-lg">Nenhum livro por aqui ainda.</p>
            <Link href="/criar" className="btn-primary mt-6">Criar o primeiro livro</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {books.map((b: any) => (
              <Link key={b.id} href={`/livro/${b.id}`} className="card group overflow-hidden transition hover:-translate-y-1">
                <div className="aspect-square bg-magic-100">
                  {b.cover_url ? (
                    <img src={b.cover_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center text-5xl">📖</div>
                  )}
                </div>
                <div className="space-y-1 p-4">
                  <p className="font-display font-bold leading-tight">{b.title ?? `Livro de ${b.child?.name}`}</p>
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${b.status === "ready" ? "bg-green-100 text-green-700" : "bg-sun-300/40 text-ink/70"}`}>
                    {STATUS_LABEL[b.status] ?? b.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
