"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MAX_COMPANIONS, PLANS, STYLES, THEMES, VALUES } from "@/lib/catalog";
import { brl } from "@/lib/format";
import type { ChildInfo, Companion } from "@/lib/types";

const STEPS = ["Criança", "Turma", "Aventura", "Estilo", "Finalizar"];

const HAIR_COLORS = ["preto", "castanho escuro", "castanho claro", "loiro", "ruivo"];
const HAIR_TYPES = ["liso", "ondulado", "cacheado", "crespo"];
const HAIR_LENGTHS = ["raspado", "curto", "médio", "longo"];
const SKIN = [
  { v: "muito clara", c: "#f8dcc6" },
  { v: "clara", c: "#eec4a2" },
  { v: "morena clara", c: "#d4a07a" },
  { v: "morena", c: "#a8724e" },
  { v: "negra", c: "#6b4430" },
];
const EYES = ["castanhos", "pretos", "verdes", "azuis", "mel"];
const COMPANION_KINDS: { v: Companion["kind"]; label: string; emoji: string; hint: string }[] = [
  { v: "pessoa", label: "Pessoa", emoji: "👨‍👩‍👧", hint: "Mamãe, vovó, irmão, amigo…" },
  { v: "pet", label: "Bichinho", emoji: "🐶", hint: "Cachorro, gato, coelho…" },
  { v: "brinquedo", label: "Brinquedo", emoji: "🧸", hint: "Ursinho, boneca, dino…" },
];

const SUGGESTED_IDEAS = [
  { emoji: "🏖️", text: "Uma viagem inesquecível para a praia onde encontramos conchinhas que brilham no escuro" },
  { emoji: "🚲", text: "Aprendendo a andar de bicicleta sem rodinhas e descobrindo a coragem de tentar de novo" },
  { emoji: "🌙", text: "Vencendo o medo do escuro com a ajuda de um vaga-lume conselheiro e estrelas amigas" },
  { emoji: "🐶", text: "Uma tarde no quintal onde nosso bichinho vira um explorador de mundos mágicos" },
  { emoji: "🚀", text: "Uma expedição espacial até um planeta feito de doces, algodão-doce e brinquedos" },
  { emoji: "🦖", text: "O ursinho ou brinquedo favorito ganha vida à noite para uma missão secreta de amizade" },
];

const LOADING = [
  "A Coruja Lulu está abrindo o livro mágico… 🦉",
  "Chamando os personagens da história… ✨",
  "Escrevendo a primeira página e a capa… 📖",
  "Escolhendo as palavras mais doces e bonitas… 💛",
  "Espalhando pó de estrelas nas ilustrações… 🌟",
  "Quase pronto! Preparando sua prévia grátis… 🎉",
];

/** Reduz a foto no navegador (máx. 1024px) para upload rápido. */
async function shrink(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1024 / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", 0.9));
}

function Chips({ options, value, onChange }: { options: string[]; value?: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button type="button" key={o} onClick={() => onChange(value === o ? "" : o)} className={`chip ${value === o ? "chip-on" : ""}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

export default function Wizard() {
  const router = useRouter();
  const params = useSearchParams();

  const [step, setStep] = useState(0);
  const [child, setChild] = useState<ChildInfo>({ name: "", age: 5, gender: "neutro" });
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoConsent, setPhotoConsent] = useState(false);
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [themeId, setThemeId] = useState(params.get("tema") ?? "");
  const [customIdea, setCustomIdea] = useState("");
  const [valueId, setValueId] = useState("");
  const [styleId, setStyleId] = useState("3d");
  const [dedication, setDedication] = useState("");
  const [planId, setPlanId] = useState(params.get("plano") ?? PLANS.find((p) => p.highlight)?.id ?? PLANS[0].id);
  const [buyer, setBuyer] = useState({ name: "", email: "", whatsapp: "" });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);

  // rascunho salvo no navegador (não perde ao recarregar)
  useEffect(() => {
    const raw = localStorage.getItem("lulu-draft") || localStorage.getItem("euv-draft");
    if (!raw) return;
    try {
      const d = JSON.parse(raw);
      if (d.child) setChild(d.child);
      if (d.companions) setCompanions(d.companions);
      if (!params.get("tema") && d.themeId) setThemeId(d.themeId);
      if (d.valueId) setValueId(d.valueId);
      if (d.styleId) setStyleId(d.styleId);
      if (d.dedication) setDedication(d.dedication);
      if (d.buyer) setBuyer(d.buyer);
      if (d.customIdea) setCustomIdea(d.customIdea);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    localStorage.setItem("lulu-draft", JSON.stringify({ child, companions, themeId, valueId, styleId, dedication, buyer, customIdea }));
  }, [child, companions, themeId, valueId, styleId, dedication, buyer, customIdea]);

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setLoadingMsg((m) => (m + 1) % LOADING.length), 3500);
    return () => clearInterval(t);
  }, [loading]);

  const plan = useMemo(() => PLANS.find((p) => p.id === planId)!, [planId]);
  const setC = <K extends keyof ChildInfo>(k: K, v: ChildInfo[K]) => setChild((c) => ({ ...c, [k]: v }));

  function validate(s: number): string {
    if (s === 0) {
      if (child.name.trim().length < 2) return "Qual o nome do nosso herói?";
      if (photo && !photoConsent) return "Autorize o uso da foto (ou remova-a).";
    }
    if (s === 1 && companions.some((c) => !c.name.trim())) return "Dê um nome para cada personagem (ou remova).";
    if (s === 2) {
      if (!themeId) return "Escolha uma aventura.";
      if (themeId === "custom" && customIdea.trim().length < 10) return "Conte um pouco mais sobre a sua ideia.";
      if (!valueId) return "Escolha a mensagem da história.";
    }
    if (s === 4) {
      if (buyer.name.trim().length < 2) return "Informe seu nome.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(buyer.email)) return "Informe um e-mail válido.";
      if (!consent) return "Aceite os termos para continuar.";
    }
    return "";
  }

  function next() {
    const e = validate(step);
    setError(e);
    if (!e) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function onPhoto(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Envie uma imagem (JPG ou PNG).");
    const small = await shrink(file);
    setPhoto(small);
    setPhotoUrl(URL.createObjectURL(small));
  }

  async function submit() {
    const e = validate(4);
    setError(e);
    if (e) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append(
        "data",
        JSON.stringify({ child, companions, themeId, customIdea, valueId, styleId, dedication, planId, buyer, consent, photoConsent })
      );
      if (photo && photoConsent) fd.append("photo", photo, "foto.jpg");
      const res = await fetch("/api/books", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao criar a história.");
      localStorage.removeItem("lulu-draft");
      localStorage.removeItem("euv-draft");
      router.push(`/livro/${json.id}`);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  // ------------------------------------------------------------------ UI
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-gradient-to-b from-magic-900 to-magic-600 p-6 text-center text-white">
        <div className="space-y-6">
          <div className="mx-auto animate-float text-8xl">📖</div>
          <h2 className="font-display text-3xl font-extrabold">Criando a história de {child.name}</h2>
          <p className="text-lg text-sun-300">{LOADING[loadingMsg]}</p>
          <div className="mx-auto h-2 w-64 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-sun-400 transition-all duration-[3000ms]" style={{ width: `${((loadingMsg + 1) / LOADING.length) * 100}%` }} />
          </div>
          <p className="text-sm text-white/60">Isso leva de 20 a 40 segundos. Não feche esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* progresso */}
      <ol className="mb-8 flex items-center justify-between gap-1">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-1 flex-col items-center gap-1">
            <button
              type="button"
              disabled={i > step}
              onClick={() => setStep(i)}
              className={`grid h-10 w-10 place-items-center rounded-full font-display font-bold transition ${
                i < step ? "bg-magic-500 text-white" : i === step ? "bg-sun-400 text-ink ring-4 ring-sun-300/50" : "bg-magic-100 text-ink/40"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </button>
            <span className={`text-xs font-semibold ${i === step ? "text-magic-700" : "text-ink/50"}`}>{s}</span>
          </li>
        ))}
      </ol>

      <div className="card space-y-6 p-6 md:p-8">
        {/* ---------------- PASSO 1: CRIANÇA ---------------- */}
        {step === 0 && (
          <>
            <header>
              <h1 className="font-display text-3xl font-extrabold">Quem é o herói? 🦸</h1>
              <p className="text-ink/60">Conte sobre a criança que vai estrelar o livro.</p>
            </header>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Nome da criança *</label>
                <input className="input" value={child.name} maxLength={40} onChange={(e) => setC("name", e.target.value)} placeholder="Ex.: Duda" />
              </div>
              <div>
                <label className="label">Idade: {child.age} {child.age === 1 ? "ano" : "anos"}</label>
                <input type="range" min={0} max={12} value={child.age} onChange={(e) => setC("age", Number(e.target.value))} className="mt-3 w-full accent-magic-600" />
              </div>
            </div>
            <div>
              <label className="label">É…</label>
              <div className="flex flex-wrap gap-2">
                {(["menino", "menina", "neutro"] as const).map((g) => (
                  <button key={g} type="button" onClick={() => setC("gender", g)} className={`chip ${child.gender === g ? "chip-on" : ""}`}>
                    {g === "menino" ? "👦 Menino" : g === "menina" ? "👧 Menina" : "🌈 Prefiro não dizer"}
                  </button>
                ))}
              </div>
            </div>

            {/* FOTO */}
            <div className="rounded-3xl border-2 border-dashed border-magic-200 bg-magic-50/50 p-5">
              <label className="label">📸 Foto do rostinho (opcional, deixa o personagem mais parecido)</label>
              <div className="flex flex-wrap items-center gap-4">
                {photoUrl ? (
                  <img src={photoUrl} alt="" className="h-24 w-24 rounded-2xl object-cover ring-4 ring-white" />
                ) : (
                  <div className="grid h-24 w-24 place-items-center rounded-2xl bg-white text-4xl">🙂</div>
                )}
                <div className="space-y-2">
                  <label className="btn-ghost cursor-pointer">
                    {photoUrl ? "Trocar foto" : "Escolher foto"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => onPhoto(e.target.files?.[0])} />
                  </label>
                  {photoUrl && (
                    <button type="button" className="block text-sm text-coral-400 underline" onClick={() => { setPhoto(null); setPhotoUrl(null); setPhotoConsent(false); }}>
                      Remover foto
                    </button>
                  )}
                </div>
              </div>
              {photoUrl && (
                <label className="mt-4 flex items-start gap-2 text-sm text-ink/70">
                  <input type="checkbox" checked={photoConsent} onChange={(e) => setPhotoConsent(e.target.checked)} className="mt-1 accent-magic-600" />
                  Sou responsável pela criança e autorizo o uso da foto apenas para criar as ilustrações. Ela é apagada quando o livro fica pronto.
                </label>
              )}
              <p className="mt-2 text-xs text-ink/50">Dica: foto de frente, com boa luz e só a criança.</p>
            </div>

            <details className="rounded-3xl bg-magic-50/50 p-5" open={!photoUrl}>
              <summary className="cursor-pointer font-display font-bold">✏️ Aparência (ajuda a IA a acertar)</summary>
              <div className="mt-4 space-y-4">
                <div><label className="label">Cor do cabelo</label><Chips options={HAIR_COLORS} value={child.hairColor} onChange={(v) => setC("hairColor", v)} /></div>
                <div><label className="label">Tipo de cabelo</label><Chips options={HAIR_TYPES} value={child.hairType} onChange={(v) => setC("hairType", v)} /></div>
                <div><label className="label">Comprimento</label><Chips options={HAIR_LENGTHS} value={child.hairLength} onChange={(v) => setC("hairLength", v)} /></div>
                <div>
                  <label className="label">Tom de pele</label>
                  <div className="flex flex-wrap gap-3">
                    {SKIN.map((s) => (
                      <button key={s.v} type="button" title={s.v} onClick={() => setC("skinTone", child.skinTone === s.v ? "" : s.v)}
                        className={`h-11 w-11 rounded-full ring-offset-2 transition ${child.skinTone === s.v ? "ring-4 ring-magic-500" : "ring-2 ring-magic-100"}`}
                        style={{ background: s.c }} />
                    ))}
                  </div>
                </div>
                <div><label className="label">Olhos</label><Chips options={EYES} value={child.eyeColor} onChange={(v) => setC("eyeColor", v)} /></div>
                <label className="flex items-center gap-2 font-semibold">
                  <input type="checkbox" checked={!!child.glasses} onChange={(e) => setC("glasses", e.target.checked)} className="accent-magic-600" /> Usa óculos 👓
                </label>
              </div>
            </details>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Cor favorita</label>
                <input className="input" value={child.favoriteColor ?? ""} maxLength={30} onChange={(e) => setC("favoriteColor", e.target.value)} placeholder="Ex.: roxo" />
              </div>
              <div>
                <label className="label">O que ama fazer?</label>
                <input className="input" value={child.likes ?? ""} maxLength={200} onChange={(e) => setC("likes", e.target.value)} placeholder="Ex.: dançar, dinossauros, desenhar" />
              </div>
            </div>
          </>
        )}

        {/* ---------------- PASSO 2: TURMA ---------------- */}
        {step === 1 && (
          <>
            <header>
              <h1 className="font-display text-3xl font-extrabold">Quem vai junto? 👨‍👩‍👧‍👦</h1>
              <p className="text-ink/60">Adicione até {MAX_COMPANIONS} personagens: família, pet ou brinquedo favorito. É opcional!</p>
            </header>
            <div className="space-y-4">
              {companions.map((c, i) => (
                <div key={i} className="rounded-3xl border-2 border-magic-100 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex gap-2">
                      {COMPANION_KINDS.map((k) => (
                        <button key={k.v} type="button" onClick={() => setCompanions((l) => l.map((x, j) => (j === i ? { ...x, kind: k.v } : x)))}
                          className={`chip ${c.kind === k.v ? "chip-on" : ""}`}>{k.emoji} {k.label}</button>
                      ))}
                    </div>
                    <button type="button" onClick={() => setCompanions((l) => l.filter((_, j) => j !== i))} className="text-sm text-coral-400">Remover</button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <input className="input" placeholder="Nome *" maxLength={40} value={c.name}
                      onChange={(e) => setCompanions((l) => l.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                    <input className="input" placeholder={COMPANION_KINDS.find((k) => k.v === c.kind)!.hint} maxLength={40} value={c.relation}
                      onChange={(e) => setCompanions((l) => l.map((x, j) => (j === i ? { ...x, relation: e.target.value } : x)))} />
                    <input className="input" placeholder="Como é? (ex.: barba, caramelo)" maxLength={120} value={c.description}
                      onChange={(e) => setCompanions((l) => l.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} />
                  </div>
                </div>
              ))}
              {companions.length < MAX_COMPANIONS && (
                <button type="button" className="btn-ghost w-full" onClick={() => setCompanions((l) => [...l, { kind: "pessoa", name: "", relation: "", description: "" }])}>
                  ＋ Adicionar personagem
                </button>
              )}
            </div>
          </>
        )}

        {/* ---------------- PASSO 3: AVENTURA ---------------- */}
        {step === 2 && (
          <>
            <header>
              <h1 className="font-display text-3xl font-extrabold">Qual a aventura? 🗺️</h1>
              <p className="text-ink/60">Escolha uma história pronta da estante ou descreva uma nova aventura do seu jeito.</p>
            </header>

            {/* Alternador de Modo: Descrever Nova vs Escolher da Estante */}
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-magic-100/70 p-1.5 border border-magic-200">
              <button
                type="button"
                onClick={() => setThemeId("custom")}
                className={`flex items-center justify-center gap-2 rounded-xl py-3 px-3 font-display text-sm font-black transition-all ${
                  themeId === "custom"
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-ink shadow-md"
                    : "text-ink/75 hover:text-magic-800"
                }`}
              >
                <span>✍️ Descrever Nova História</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (themeId === "custom") setThemeId("floresta");
                }}
                className={`flex items-center justify-center gap-2 rounded-xl py-3 px-3 font-display text-sm font-black transition-all ${
                  themeId !== "custom"
                    ? "bg-magic-600 text-white shadow-md"
                    : "text-ink/75 hover:text-magic-800"
                }`}
              >
                <span>📚 Escolher da Estante</span>
              </button>
            </div>

            {/* SE MODO: DESCREVER NOVA HISTÓRIA */}
            {themeId === "custom" ? (
              <div className="rounded-3xl border-2 border-amber-300 bg-amber-50/40 p-5 sm:p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-400 text-2xl shadow">
                    ✍️
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">
                      Conte a sua história do seu jeito
                    </h3>
                    <p className="text-xs text-ink/70">
                      A Coruja Lulu usará suas palavras para criar o enredo e as ilustrações!
                    </p>
                  </div>
                </div>

                <div>
                  <textarea
                    className="input min-h-28 text-sm"
                    maxLength={500}
                    value={customIdea}
                    onChange={(e) => setCustomIdea(e.target.value)}
                    placeholder="Ex.: O Bento viaja em um balão mágico até a terra dos dinossauros para encontrar um ovo de ouro que realiza desejos..."
                  />
                  <div className="mt-1 flex justify-between text-xs text-ink/50">
                    <span>Mínimo 10 caracteres</span>
                    <span>{customIdea.length}/500</span>
                  </div>
                </div>

                {/* Chips de Ideias Sugeridas */}
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-bold text-ink/75 uppercase tracking-wide">
                    💡 Sugestões de ideias (toque para preencher):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_IDEAS.map((idea, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCustomIdea(idea.text)}
                        className="rounded-full border border-magic-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink/80 transition hover:border-amber-400 hover:bg-amber-100/50 text-left active:scale-95 shadow-sm"
                      >
                        {idea.emoji} {idea.text.slice(0, 48)}…
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* SE MODO: ESCOLHER TEMA DA ESTANTE */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
                  {THEMES.filter((t) => t.id !== "custom").map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setThemeId(t.id)}
                      className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 text-left transition-all active:scale-95 ${
                        themeId === t.id
                          ? "border-amber-400 bg-magic-50/60 shadow-xl ring-4 ring-amber-400/20"
                          : "border-magic-100 bg-white hover:border-magic-300 hover:shadow-md"
                      }`}
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-magic-900">
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-2.5 bg-gradient-to-r from-black/50 via-white/20 to-transparent" />
                        {t.coverImage ? (
                          <img
                            src={t.coverImage}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="grid h-full place-items-center bg-gradient-to-br from-magic-700 to-magic-900 text-3xl">
                            {t.emoji}
                          </div>
                        )}
                        {themeId === t.id && (
                          <span className="absolute right-2 top-2 z-20 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black text-ink shadow">
                            ✓ Selecionado
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="font-display text-sm font-bold leading-tight text-ink">
                          {t.title}
                        </div>
                        <div className="mt-0.5 line-clamp-1 text-[11px] text-ink/60">
                          {t.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="label">Algum detalhe especial para enriquecer a história? (opcional)</label>
                  <input
                    className="input"
                    maxLength={300}
                    value={customIdea}
                    onChange={(e) => setCustomIdea(e.target.value)}
                    placeholder="Ex.: incluir o cachorrinho Totó, o apelido 'Dudinha', a comida favorita..."
                  />
                </div>
              </div>
            )}

            <div>
              <label className="label">Mensagem da história *</label>
              <div className="flex flex-wrap gap-2">
                {VALUES.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setValueId(v.id)}
                    className={`chip ${valueId === v.id ? "chip-on" : ""}`}
                  >
                    {v.emoji} {v.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ---------------- PASSO 4: ESTILO ---------------- */}
        {step === 3 && (
          <>
            <header>
              <h1 className="font-display text-3xl font-extrabold">Como vai ser o desenho? 🎨</h1>
              <p className="text-ink/60">
                Toque nos modelos abaixo para ver uma prévia real de como as páginas do seu livro serão ilustradas.
              </p>
            </header>

            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
              {STYLES.map((s) => {
                const isSelected = styleId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStyleId(s.id)}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl md:rounded-3xl border-2 text-left transition-all active:scale-[0.98] ${
                      isSelected
                        ? "border-amber-400 bg-magic-50/70 shadow-xl ring-4 ring-amber-400/20"
                        : "border-magic-100 bg-white hover:border-magic-300 hover:shadow-md"
                    }`}
                  >
                    {/* Thumbnail do modelo de arte */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-magic-900">
                      <img
                        src={s.previewImage}
                        alt={`Modelo do estilo ${s.label}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Selo no Topo do Modelo */}
                      {s.badge && (
                        <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-magic-700 shadow-sm backdrop-blur-sm">
                          {s.badge}
                        </span>
                      )}

                      {/* Indicador de Seleção */}
                      {isSelected && (
                        <span className="absolute right-2.5 top-2.5 z-10 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black text-ink shadow">
                          ✓ Selecionado
                        </span>
                      )}
                    </div>

                    {/* Descrição do Estilo */}
                    <div className="p-3 md:p-4">
                      <div className="font-display text-base font-extrabold leading-snug text-ink group-hover:text-magic-700 transition-colors">
                        {s.label}
                      </div>
                      <div className="mt-0.5 text-xs text-ink/60 line-clamp-1">
                        {s.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Destaque / Ampliação do Estilo Selecionado */}
            {(() => {
              const currentStyle = STYLES.find((s) => s.id === styleId) || STYLES[0];
              return (
                <div className="rounded-2xl border border-magic-200/80 bg-gradient-to-r from-magic-50 via-white to-amber-50/50 p-4 md:p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative aspect-square w-24 sm:w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-amber-300 shadow-md">
                      <img
                        src={currentStyle.previewImage}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <span className="font-display text-base font-black text-ink">
                          Modelo selecionado: {currentStyle.label}
                        </span>
                        {currentStyle.badge && (
                          <span className="rounded-full bg-amber-100 border border-amber-300/80 px-2.5 py-0.5 text-[11px] font-bold text-amber-900">
                            {currentStyle.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-ink/75 leading-relaxed">
                        {currentStyle.sampleDescription}
                      </p>
                      <p className="text-[11px] font-semibold text-magic-600">
                        ✨ Todas as páginas e a capa serão criadas pela Coruja Lulu neste padrão visual.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div>
              <label className="label">💌 Dedicatória na 1ª página (opcional)</label>
              <textarea
                className="input min-h-24 text-sm"
                maxLength={300}
                value={dedication}
                onChange={(e) => setDedication(e.target.value)}
                placeholder={`Para ${child.name || "você"}, que deixa nossos dias mais mágicos. Com amor, vovó Lúcia.`}
              />
              <p className="mt-1 text-right text-xs text-ink/40">{dedication.length}/300</p>
            </div>
          </>
        )}

        {/* ---------------- PASSO 5: FINALIZAR ---------------- */}
        {step === 4 && (
          <>
            <header>
              <h1 className="font-display text-3xl font-extrabold">Quase lá! 🎁</h1>
              <p className="text-ink/60">Escolha o livro e informe seus dados. A prévia com capa é grátis.</p>
            </header>
            <div className="grid gap-3 sm:grid-cols-2">
              {PLANS.map((p) => (
                <button key={p.id} type="button" onClick={() => setPlanId(p.id)}
                  className={`relative rounded-3xl border-2 p-5 text-left transition ${planId === p.id ? "border-magic-500 bg-magic-50 shadow-lg" : "border-magic-100"}`}>
                  {p.highlight && <span className="absolute -top-3 right-4 rounded-full bg-sun-400 px-3 py-0.5 text-xs font-bold">Mais escolhido</span>}
                  <div className="font-display text-xl font-bold">{p.name}</div>
                  <div className="text-sm text-ink/60">Capa + {p.pages} páginas ilustradas</div>
                  <div className="mt-2 font-display text-2xl font-extrabold text-magic-600">{brl(p.priceCents)}</div>
                </button>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">Seu nome *</label>
                <input className="input" value={buyer.name} maxLength={80} onChange={(e) => setBuyer({ ...buyer, name: e.target.value })} />
              </div>
              <div>
                <label className="label">E-mail * (seu livro fica salvo aqui)</label>
                <input type="email" className="input" value={buyer.email} maxLength={120} onChange={(e) => setBuyer({ ...buyer, email: e.target.value })} />
              </div>
              <div>
                <label className="label">WhatsApp</label>
                <input className="input" inputMode="tel" value={buyer.whatsapp} maxLength={20} placeholder="(94) 99999-9999" onChange={(e) => setBuyer({ ...buyer, whatsapp: e.target.value })} />
              </div>
            </div>
            <div className="rounded-3xl bg-magic-50 p-5 text-sm">
              <p className="font-display text-base font-bold">Resumo</p>
              <p>🦸 {child.name || "—"}, {child.age} anos {companions.length > 0 && `+ ${companions.map((c) => c.name).join(", ")}`}</p>
              <p>🗺️ {THEMES.find((t) => t.id === themeId)?.title} · {VALUES.find((v) => v.id === valueId)?.label}</p>
              <p>🎨 {STYLES.find((s) => s.id === styleId)?.label} · 📚 {plan.name} ({plan.pages} páginas)</p>
            </div>
            <label className="flex items-start gap-2 text-sm text-ink/70">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-magic-600" />
              <span>Li e aceito os <Link href="/termos" target="_blank" className="text-magic-600 underline">Termos</Link> e a{" "}
                <Link href="/privacidade" target="_blank" className="text-magic-600 underline">Política de Privacidade</Link>.</span>
            </label>
          </>
        )}

        {error && <p className="rounded-2xl bg-coral-400/10 px-4 py-3 font-semibold text-coral-400">⚠️ {error}</p>}

        <div className="flex items-center justify-between gap-3 pt-2">
          {step > 0 ? (
            <button type="button" onClick={() => { setError(""); setStep((s) => s - 1); }} className="btn-ghost">← Voltar</button>
          ) : <span />}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary">Continuar →</button>
          ) : (
            <button type="button" onClick={submit} className="btn-sun">✨ Criar minha história</button>
          )}
        </div>
      </div>
    </div>
  );
}
