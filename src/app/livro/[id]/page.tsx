import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { fetchBook, fetchPages } from "@/lib/books";
import { getPlan } from "@/lib/catalog";
import { isUuid } from "@/lib/format";
import BookClient, { type BookView } from "./BookClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!isUuid(id)) return {};
  const book = await fetchBook(supabaseAdmin(), id);
  if (!book?.title) return { title: "Livro mágico" };
  return {
    title: book.title,
    description: book.synopsis ?? undefined,
    robots: { index: false }, // livros são privados (acesso por link)
    openGraph: { title: book.title, description: book.synopsis ?? undefined, images: book.cover_url ? [book.cover_url] : [] },
  };
}

export default async function LivroPage({ params }: Props) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const db = supabaseAdmin();
  const book = await fetchBook(db, id);
  if (!book) notFound();

  const unlocked = ["paid", "generating", "ready"].includes(book.status);
  const pages = await fetchPages(db, id);
  const plan = getPlan(book.plan_id);

  // Antes do pagamento, só a 1ª página (texto) vai para o navegador.
  const view: BookView = {
    id: book.id,
    status: book.status,
    title: book.title,
    synopsis: book.synopsis,
    childName: book.child.name,
    dedication: book.dedication,
    coverUrl: book.cover_url,
    coverFailed: !book.cover_url && book.cover_attempts >= 3,
    planName: plan?.name ?? "Livro",
    priceCents: book.price_cents,
    pagesTotal: book.pages_total,
    pagesDone: book.pages_done,
    error: book.error,
    pages: (unlocked ? pages : pages.slice(0, 1)).map((p) => ({
      n: p.page_number,
      text: p.text,
      image: unlocked ? p.image_url : null,
      status: p.status,
    })),
  };

  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-gradient-to-b from-magic-50 to-cream">
        <BookClient book={view} />
      </main>
      <Footer />
    </>
  );
}
