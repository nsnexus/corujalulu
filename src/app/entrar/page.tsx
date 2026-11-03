"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function EntrarPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabaseBrowser().auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/minha-estante` },
    });
    setBusy(false);
    if (error) setError("Não foi possível enviar o link. Confira o e-mail e tente de novo.");
    else setSent(true);
  }

  return (
    <>
      <Header />
      <main className="grid min-h-[80vh] place-items-center bg-gradient-to-b from-magic-50 to-cream px-4">
        <div className="card w-full max-w-md space-y-5 p-8 text-center">
          <div className="text-6xl">📚</div>
          <h1 className="font-display text-3xl font-extrabold">Minha estante</h1>
          {sent ? (
            <p className="text-ink/70">✉️ Enviamos um link mágico para <b>{email}</b>. Abra seu e-mail e toque no link para entrar.</p>
          ) : (
            <form onSubmit={send} className="space-y-4">
              <p className="text-ink/60">Use o mesmo e-mail do pedido. Sem senha: enviamos um link de acesso.</p>
              <input type="email" required className="input" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button disabled={busy} className="btn-primary w-full">{busy ? "Enviando…" : "Receber link de acesso"}</button>
              {error && <p className="text-sm font-semibold text-coral-400">{error}</p>}
            </form>
          )}
        </div>
      </main>
    </>
  );
}
