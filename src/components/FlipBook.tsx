"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ReaderPage {
  kind: "cover" | "dedication" | "page" | "end";
  image?: string | null;
  text?: string;
  title?: string;
  number?: number;
}

export type TTSVoice = "nova" | "fable" | "alloy" | "echo" | "onyx" | "shimmer";

interface FlipBookProps {
  pages: ReaderPage[];
  childName: string;
  bookId?: string;
}

/** Leitor de livro: setas, swipe, tela cheia e narração humanizada com IA (OpenAI TTS) + fallback nativo. */
export default function FlipBook({ pages, childName, bookId }: FlipBookProps) {
  const [i, setI] = useState(0);
  const [reading, setReading] = useState(false);
  const [voiceMode, setVoiceMode] = useState<"ai" | "browser">("ai");
  const [aiVoice, setAiVoice] = useState<TTSVoice>("nova");
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [audioErrorNotice, setAudioErrorNotice] = useState<string | null>(null);

  const wrap = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoNextTimeout = useRef<NodeJS.Timeout | null>(null);

  const p = pages[i];

  const go = useCallback(
    (d: number) => {
      setI((x) => Math.max(0, Math.min(pages.length - 1, x + d)));
    },
    [pages.length]
  );

  // Navegação por teclado (setas)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // Limpeza de áudio
  const stopAllAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (autoNextTimeout.current) {
      clearTimeout(autoNextTimeout.current);
      autoNextTimeout.current = null;
    }
    setLoadingAudio(false);
  }, []);

  // Texto a ser narrado para a página atual
  const getPageText = useCallback(
    (page: ReaderPage): string => {
      if (page.kind === "cover") {
        return `${page.title || "Livro mágico"}. Uma história encantada para ${childName}.`;
      }
      if (page.kind === "dedication") {
        return `Dedicatória: ${page.text || ""}`;
      }
      if (page.kind === "end") {
        return `Fim da história. E ${childName} viveu muitas outras grandes aventuras!`;
      }
      return page.text || "";
    },
    [childName]
  );

  // Motor de Narração
  useEffect(() => {
    if (!reading) {
      stopAllAudio();
      return;
    }

    const text = getPageText(p);
    if (!text) return;

    // --- MODO 1: Narração Humanizada com IA (OpenAI TTS) ---
    if (voiceMode === "ai") {
      stopAllAudio();
      setLoadingAudio(true);
      setAudioErrorNotice(null);

      const params = new URLSearchParams({
        page: String(p.number ?? i),
        voice: aiVoice,
        text: text,
      });

      const audioUrl = `/api/books/${bookId || "local"}/audio?${params.toString()}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setLoadingAudio(false);
      };

      audio.onended = () => {
        setLoadingAudio(false);
        if (i < pages.length - 1) {
          autoNextTimeout.current = setTimeout(() => go(1), 800);
        } else {
          setReading(false);
        }
      };

      audio.onerror = () => {
        console.warn("[audio] Falha no áudio IA, usando voz do navegador.");
        setLoadingAudio(false);
        setAudioErrorNotice("Voz IA indisponível no momento. Usando voz do sistema.");
        // Fallback imediato para síntese do navegador
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          const synth = window.speechSynthesis;
          synth.cancel();
          const u = new SpeechSynthesisUtterance(text);
          u.lang = "pt-BR";
          u.rate = 0.92;
          u.onend = () => {
            if (i < pages.length - 1) {
              autoNextTimeout.current = setTimeout(() => go(1), 700);
            } else {
              setReading(false);
            }
          };
          synth.speak(u);
        }
      };

      audio.play().catch((err) => {
        console.warn("[audio] Autoplay bloqueado ou falhou:", err);
        setLoadingAudio(false);
      });

      return () => {
        stopAllAudio();
      };
    }

    // --- MODO 2: Narração Nativa do Navegador (Web Speech API) ---
    if (voiceMode === "browser") {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "pt-BR";
      u.rate = 0.92;
      u.pitch = 1.05;

      const voices = synth.getVoices();
      const voice =
        voices.find((v) => v.lang.toLowerCase().startsWith("pt-br")) ??
        voices.find((v) => v.lang.startsWith("pt"));
      if (voice) u.voice = voice;

      u.onend = () => {
        if (i < pages.length - 1) {
          autoNextTimeout.current = setTimeout(() => go(1), 700);
        } else {
          setReading(false);
        }
      };

      synth.speak(u);

      return () => {
        synth.cancel();
      };
    }
  }, [i, reading, voiceMode, aiVoice, p, getPageText, go, pages.length, bookId, stopAllAudio]);

  const toggleReading = () => {
    setReading((r) => !r);
  };

  const fullscreen = () => {
    const el = wrap.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  };

  return (
    <div
      ref={wrap}
      className="flex flex-col gap-4 bg-cream [&:fullscreen]:justify-center [&:fullscreen]:p-6"
    >
      {/* Barra de controle de narração */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-magic-200/70 bg-white/90 p-3 shadow-sm backdrop-blur">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleReading}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 font-display text-sm font-bold shadow-sm transition ${
              reading
                ? "bg-coral-400 text-white shadow-coral-400/30 hover:bg-coral-500 animate-pulse"
                : "bg-gradient-to-r from-magic-600 to-magic-500 text-white shadow-magic-500/20 hover:scale-[1.02]"
            }`}
          >
            {reading ? (
              <>
                <span>⏸</span> Pausar Narração
              </>
            ) : (
              <>
                <span>🎧</span> Ouvir História Mágica ✨
              </>
            )}
          </button>

          {loadingAudio && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-magic-600 animate-pulse">
              <span className="inline-block h-2 w-2 rounded-full bg-magic-500 animate-ping" />
              Sintetizando voz humana...
            </span>
          )}

          {reading && !loadingAudio && (
            <div className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-magic-700 bg-magic-50 rounded-full">
              <span className="animate-bounce">🎵</span>
              <span>Narrando agora</span>
            </div>
          )}
        </div>

        {/* Escolha do narrador */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="text-ink/60">Narrador:</span>

          <button
            onClick={() => {
              setVoiceMode("ai");
              setAiVoice("nova");
            }}
            className={`rounded-full px-3 py-1.5 transition ${
              voiceMode === "ai" && aiVoice === "nova"
                ? "bg-magic-600 text-white shadow"
                : "border border-magic-200 bg-white text-ink/70 hover:border-magic-400"
            }`}
            title="Voz carinhosa, expressiva e acolhedora"
          >
            👩 Tia Nova ✨
          </button>

          <button
            onClick={() => {
              setVoiceMode("ai");
              setAiVoice("fable");
            }}
            className={`rounded-full px-3 py-1.5 transition ${
              voiceMode === "ai" && aiVoice === "fable"
                ? "bg-magic-600 text-white shadow"
                : "border border-magic-200 bg-white text-ink/70 hover:border-magic-400"
            }`}
            title="Voz animada e teatral"
          >
            👨 Tio Fable 🎩
          </button>

          <button
            onClick={() => setVoiceMode("browser")}
            className={`rounded-full px-3 py-1.5 transition ${
              voiceMode === "browser"
                ? "bg-ink text-white shadow"
                : "border border-magic-100 bg-white text-ink/50 hover:border-magic-300"
            }`}
            title="Voz padrão gratuita do seu dispositivo"
          >
            🤖 Sistema
          </button>
        </div>
      </div>

      {audioErrorNotice && (
        <div className="rounded-xl bg-sun-300/30 p-2 text-center text-xs font-semibold text-ink/80">
          ⚠️ {audioErrorNotice}
        </div>
      )}

      {/* Livro / Páginas */}
      <div
        className="card relative overflow-hidden"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <div key={i} className="grid animate-page-in md:grid-cols-2">
          {/* lado da imagem */}
          <div className="relative aspect-square bg-magic-100">
            {p.kind === "cover" || p.kind === "page" ? (
              p.image ? (
                <img src={p.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-6xl">🎨</div>
              )
            ) : (
              <div className="grid h-full place-items-center bg-gradient-to-br from-magic-600 to-magic-900 text-8xl">
                {p.kind === "end" ? "🌙" : "💌"}
              </div>
            )}
          </div>

          {/* lado do texto */}
          <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
            {p.kind === "cover" && (
              <>
                <p className="font-display font-bold text-magic-500">
                  Uma história para {childName}
                </p>
                <h2 className="font-display text-4xl font-extrabold leading-tight md:text-5xl">
                  {p.title}
                </h2>
                <p className="text-ink/50">Toque em → ou ouça a narração acima</p>
              </>
            )}
            {p.kind === "dedication" && (
              <>
                <p className="font-display text-2xl font-bold text-magic-600">Dedicatória</p>
                <p className="whitespace-pre-line font-display text-2xl italic leading-relaxed">
                  {p.text}
                </p>
              </>
            )}
            {p.kind === "page" && (
              <p className="whitespace-pre-line font-display text-xl leading-relaxed md:text-2xl">
                {p.text}
              </p>
            )}
            {p.kind === "end" && (
              <>
                <h2 className="font-display text-6xl font-extrabold text-magic-600">Fim</h2>
                <p className="text-xl">E {childName} viveu muitas outras aventuras…</p>
              </>
            )}
            {p.number && (
              <p className="mt-auto text-right font-display font-bold text-magic-400">
                Página {p.number} de {pages.filter((x) => x.kind === "page").length}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* controles de navegação */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => go(-1)}
          disabled={i === 0}
          className="btn-ghost disabled:opacity-40"
        >
          ← Página anterior
        </button>

        <button onClick={fullscreen} className="btn-ghost" title="Tela cheia">
          ⛶ Tela cheia
        </button>

        <button
          onClick={() => go(1)}
          disabled={i === pages.length - 1}
          className="btn-primary px-6 py-3 disabled:opacity-40"
        >
          Próxima página →
        </button>
      </div>

      {/* Barra de progresso / Marcadores de página */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {pages.map((_, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            aria-label={`Página ${k + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              k === i ? "w-8 bg-magic-500" : "w-2.5 bg-magic-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
