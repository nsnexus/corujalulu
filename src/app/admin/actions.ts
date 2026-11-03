"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/env";
import { markPaid } from "@/lib/books";
import { isUuid } from "@/lib/format";

async function guard(id: string) {
  const user = await currentUser();
  if (!isAdminEmail(user?.email)) throw new Error("Sem permissão");
  if (!isUuid(id)) throw new Error("id inválido");
}

/** Libera o livro manualmente (ex.: cortesia ou Pix recebido fora do checkout). */
export async function adminMarkPaid(id: string) {
  await guard(id);
  await markPaid(id, null);
  revalidatePath("/admin");
}

/** Reprocessa: zera erros/tentativas e devolve para a fila. */
export async function adminRetry(id: string) {
  await guard(id);
  const db = supabaseAdmin();
  const { data: b } = await db.from("books").select("paid_at,title").eq("id", id).single();
  await db.from("book_pages").update({ status: "pending", attempts: 0 }).eq("book_id", id).eq("status", "failed");
  await db
    .from("books")
    .update({
      error: null,
      cover_attempts: 0,
      locked_until: null,
      status: b?.paid_at ? "paid" : b?.title ? "preview_ready" : "failed",
    })
    .eq("id", id);
  revalidatePath("/admin");
}

/** Refaz a ilustração de uma página específica (0 = capa). */
export async function adminRedoPage(id: string, page: number) {
  await guard(id);
  const db = supabaseAdmin();
  if (page === 0) {
    await db.from("books").update({ cover_url: null, cover_attempts: 0 }).eq("id", id);
  } else {
    await db.from("book_pages").update({ status: "pending", attempts: 0, image_url: null }).eq("book_id", id).eq("page_number", page);
  }
  const { data: b } = await db.from("books").select("status").eq("id", id).single();
  if (b?.status === "ready") await db.from("books").update({ status: "generating" }).eq("id", id);
  revalidatePath("/admin");
}
