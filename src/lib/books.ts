import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { buildImagePrompt, describePhoto, generateImageSafe, generateStory, type RefImage } from "@/lib/ai";
import { createPreference, findApprovedPayment, type MPPayment } from "@/lib/mercadopago";
import { getPlan } from "@/lib/catalog";
import { paymentsDisabled, siteUrl } from "@/lib/env";
import type { BookInput, BookRow, PageRow, StepResult } from "@/lib/types";

const IMAGES = "book-images";
const PHOTOS = "child-photos";
const MAX_ATTEMPTS = 3;

export async function fetchBook(db: SupabaseClient, id: string): Promise<BookRow | null> {
  const { data } = await db.from("books").select("*").eq("id", id).maybeSingle();
  return (data as BookRow) ?? null;
}

export async function fetchPages(db: SupabaseClient, id: string): Promise<PageRow[]> {
  const { data } = await db.from("book_pages").select("*").eq("book_id", id).order("page_number");
  return (data as PageRow[]) ?? [];
}

const summary = (b: BookRow, extra: Partial<StepResult> = {}): StepResult => ({
  status: b.status,
  coverUrl: b.cover_url,
  pagesDone: b.pages_done,
  pagesTotal: b.pages_total,
  error: b.error,
  ...extra,
});

// =====================================================================
// CRIAÇÃO: grava o pedido, analisa a foto e escreve a história
// =====================================================================
export async function createBook(
  input: BookInput,
  photo: { bytes: Uint8Array; mime: string } | null,
  userId: string | null
): Promise<string> {
  const db = supabaseAdmin();
  const plan = getPlan(input.planId)!;

  // limite anti-abuso: 5 prévias não pagas por e-mail em 24h
  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { count } = await db
    .from("books")
    .select("id", { count: "exact", head: true })
    .eq("buyer_email", input.buyer.email.toLowerCase())
    .is("paid_at", null)
    .gte("created_at", since);
  if ((count ?? 0) >= 5) throw new Error("LIMIT: Limite de prévias atingido. Tente novamente amanhã.");

  const { data: row, error } = await db
    .from("books")
    .insert({
      status: "draft",
      user_id: userId,
      buyer_name: input.buyer.name,
      buyer_email: input.buyer.email.toLowerCase(),
      buyer_whatsapp: input.buyer.whatsapp || null,
      plan_id: plan.id,
      price_cents: plan.priceCents, // preço SEMPRE vem do servidor
      pages_total: plan.pages,
      child: input.child,
      companions: input.companions,
      theme_id: input.themeId,
      custom_idea: input.customIdea || null,
      value_id: input.valueId,
      style_id: input.styleId,
      dedication: input.dedication || null,
    })
    .select("id")
    .single();
  if (error || !row) throw new Error(`Falha ao salvar: ${error?.message}`);
  const id = row.id as string;

  try {
    let appearance: string | undefined;
    if (photo && input.photoConsent) {
      const ext = photo.mime === "image/png" ? "png" : photo.mime === "image/webp" ? "webp" : "jpg";
      const path = `${id}/foto.${ext}`;
      const up = await db.storage.from(PHOTOS).upload(path, photo.bytes, { contentType: photo.mime, upsert: true });
      if (up.error) throw new Error(`Upload da foto: ${up.error.message}`);
      await db.from("books").update({ photo_path: path }).eq("id", id);
      appearance = await describePhoto(photo.bytes, photo.mime).catch(() => undefined);
    }

    const story = await generateStory(input, plan.pages, appearance);

    await db.from("book_pages").insert(
      story.pages.map((p, i) => ({ book_id: id, page_number: i + 1, text: p.text.trim(), scene: p.scene.trim() }))
    );
    await db
      .from("books")
      .update({
        status: "preview_ready",
        title: story.title.trim(),
        synopsis: story.synopsis.trim(),
        character_sheet: story.character_sheet.trim(),
        cover_prompt: story.cover_scene.trim(),
        pages_total: story.pages.length,
        child: { ...input.child, appearanceFromPhoto: appearance },
      })
      .eq("id", id);
    return id;
  } catch (e) {
    await db.from("books").update({ status: "failed", error: (e as Error).message.slice(0, 500) }).eq("id", id);
    throw e;
  }
}

// =====================================================================
// PAGAMENTO
// =====================================================================
export async function startCheckout(id: string): Promise<string> {
  const db = supabaseAdmin();
  const book = await fetchBook(db, id);
  if (!book) throw new Error("Livro não encontrado.");
  if (["paid", "generating", "ready"].includes(book.status)) return `${siteUrl()}/livro/${id}`;
  if (!["preview_ready", "awaiting_payment"].includes(book.status)) throw new Error("Livro ainda não está pronto para pagamento.");

  if (paymentsDisabled()) {
    await markPaid(id, null);
    return `${siteUrl()}/livro/${id}?pagamento=ok`;
  }

  const pref = await createPreference(book);
  await db.from("books").update({ status: "awaiting_payment", mp_preference_id: pref.id }).eq("id", id);
  return pref.url;
}

export async function markPaid(bookId: string, payment: MPPayment | null): Promise<boolean> {
  const db = supabaseAdmin();
  const book = await fetchBook(db, bookId);
  if (!book) return false;

  if (payment) {
    // confere o valor pago contra o preço registrado
    if (Math.round(payment.transaction_amount * 100) < book.price_cents) {
      console.error("[pagamento] valor divergente", bookId, payment.transaction_amount);
      return false;
    }
    await db.from("payments").upsert(
      {
        book_id: bookId,
        provider_id: String(payment.id),
        status: payment.status,
        amount_cents: Math.round(payment.transaction_amount * 100),
        method: payment.payment_method_id,
        raw: payment,
      },
      { onConflict: "provider_id" }
    );
  }

  if (["paid", "generating", "ready"].includes(book.status)) return true;

  await db
    .from("books")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      mp_payment_id: payment ? String(payment.id) : "manual",
      error: null,
    })
    .eq("id", bookId)
    .in("status", ["draft", "preview_ready", "awaiting_payment", "failed"]);
  return true;
}

async function syncPayment(book: BookRow) {
  if (paymentsDisabled() || !book.mp_preference_id) return;
  const p = await findApprovedPayment(book.id).catch(() => null);
  if (p) await markPaid(book.id, p);
}

// =====================================================================
// GERAÇÃO INCREMENTAL — cada chamada gera 1 imagem (capa ou página).
// O navegador chama em loop; se fechar a aba, continua de onde parou.
// =====================================================================
async function download(db: SupabaseClient, bucket: string, path: string): Promise<RefImage | null> {
  const { data } = await db.storage.from(bucket).download(path);
  if (!data) return null;
  return { bytes: new Uint8Array(await data.arrayBuffer()), mime: data.type || "image/jpeg", filename: path.split("/").pop()! };
}

async function uploadImage(db: SupabaseClient, path: string, bytes: Uint8Array): Promise<string> {
  const { error } = await db.storage.from(IMAGES).upload(path, bytes, { contentType: "image/jpeg", upsert: true });
  if (error) throw new Error(`Upload imagem: ${error.message}`);
  const { data } = db.storage.from(IMAGES).getPublicUrl(path);
  return `${data.publicUrl}?v=${Date.now()}`;
}

async function generateCover(db: SupabaseClient, book: BookRow) {
  const refs: RefImage[] = [];
  if (book.photo_path) {
    const photo = await download(db, PHOTOS, book.photo_path);
    if (photo) refs.push(photo);
  }
  const prompt = buildImagePrompt({
    styleId: book.style_id,
    characterSheet: book.character_sheet ?? "",
    scene: book.cover_prompt ?? "",
    cover: true,
  });
  const bytes = await generateImageSafe(prompt, refs);
  const url = await uploadImage(db, `${book.id}/capa.jpg`, bytes);
  await db.from("books").update({ cover_url: url, error: null }).eq("id", book.id);
}

async function generatePage(db: SupabaseClient, book: BookRow, page: PageRow) {
  const refs: RefImage[] = [];
  const cover = await download(db, IMAGES, `${book.id}/capa.jpg`);
  if (cover) refs.push(cover);
  if (book.photo_path) {
    const photo = await download(db, PHOTOS, book.photo_path);
    if (photo) refs.push(photo);
  }
  const prompt = buildImagePrompt({
    styleId: book.style_id,
    characterSheet: book.character_sheet ?? "",
    scene: page.scene,
  });
  const bytes = await generateImageSafe(prompt, refs);
  const n = String(page.page_number).padStart(2, "0");
  const url = await uploadImage(db, `${book.id}/pagina-${n}.jpg`, bytes);
  await db.from("book_pages").update({ image_url: url, status: "done" }).eq("id", page.id);
}

async function finalize(db: SupabaseClient, book: BookRow) {
  // LGPD: apaga a foto da criança assim que o livro fica pronto
  if (book.photo_path) await db.storage.from(PHOTOS).remove([book.photo_path]);
  await db
    .from("books")
    .update({ status: "ready", ready_at: new Date().toISOString(), photo_path: null })
    .eq("id", book.id);
}

async function countDone(db: SupabaseClient, id: string) {
  const { count } = await db
    .from("book_pages")
    .select("id", { count: "exact", head: true })
    .eq("book_id", id)
    .eq("status", "done");
  return count ?? 0;
}

export async function runStep(id: string): Promise<StepResult> {
  const db = supabaseAdmin();
  let book = await fetchBook(db, id);
  if (!book) throw new Error("NOT_FOUND");

  if (book.status === "awaiting_payment") {
    await syncPayment(book);
    book = (await fetchBook(db, id))!;
  }

  const prePay = ["preview_ready", "awaiting_payment"].includes(book.status);
  const paid = ["paid", "generating"].includes(book.status);

  let task: "cover" | "page" | null = null;
  if (!book.cover_url && (prePay || paid) && book.cover_attempts < MAX_ATTEMPTS) task = "cover";
  else if (paid) task = "page";
  if (!task) return summary(book);

  const { data: locked } = await db.rpc("acquire_book_lock", { p_id: id, p_seconds: 150 });
  if (!locked) return summary(book, { busy: true });

  try {
    if (task === "cover") {
      try {
        await generateCover(db, book);
      } catch (e) {
        const attempts = book.cover_attempts + 1;
        await db
          .from("books")
          .update({ cover_attempts: attempts, error: (e as Error).message.slice(0, 500) })
          .eq("id", id);
        throw e;
      }
    } else {
      if (book.status === "paid") await db.from("books").update({ status: "generating" }).eq("id", id);

      const { data: next } = await db
        .from("book_pages")
        .select("*")
        .eq("book_id", id)
        .eq("status", "pending")
        .order("page_number")
        .limit(1)
        .maybeSingle();

      if (!next) {
        await finalize(db, book);
      } else {
        const page = next as PageRow;
        try {
          await generatePage(db, book, page);
        } catch (e) {
          const attempts = page.attempts + 1;
          await db
            .from("book_pages")
            .update({ attempts, status: attempts >= MAX_ATTEMPTS ? "failed" : "pending" })
            .eq("id", page.id);
          await db.from("books").update({ error: (e as Error).message.slice(0, 500) }).eq("id", id);
          throw e;
        }
        await db.from("books").update({ pages_done: await countDone(db, id) }).eq("id", id);
      }
    }
  } catch (e) {
    console.error("[step]", id, (e as Error).message);
  } finally {
    await db.rpc("release_book_lock", { p_id: id });
  }

  return summary((await fetchBook(db, id))!);
}
