"use client";

import { useState, useRef } from "react";

export default function AudioPreviewSample() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<"nova" | "fable">("nova");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const sampleText =
    selectedVoice === "nova"
      ? "Era uma vez, no alto de uma montanha mágica, onde as estrelas tocavam o chão... O pequeno herói abriu seus olhinhos curiosos e descobriu que a coragem é como uma luzinha que nunca se apaga dentro da gente."
      : "Atenção tripulação estelar! O capitão já ajustou as lunetas mágicas e estamos prontos para a maior decolagem da história do universo!";

  const togglePlay = () => {
    if (isPlaying) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(sampleText);
      u.lang = "pt-BR";
      u.rate = selectedVoice === "nova" ? 0.92 : 1.0;
      u.pitch = selectedVoice === "nova" ? 1.08 : 0.95;

      const voices = window.speechSynthesis.getVoices();
      const ptVoice =
        voices.find((v) => v.lang.toLowerCase().startsWith("pt-br")) ??
        voices.find((v) => v.lang.startsWith("pt"));
      if (ptVoice) u.voice = ptVoice;

      u.onend = () => setIsPlaying(false);
      u.onerror = () => setIsPlaying(false);

      utteranceRef.current = u;
      window.speechSynthesis.speak(u);
      setIsPlaying(true);
    }
  };

  return (
    <div className="rounded-3xl border-2 border-magic-200/80 bg-white/95 p-5 sm:p-7 shadow-xl shadow-magic-500/10 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-magic-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-magic-600 to-magic-400 text-2xl text-white shadow-md">
            🎧
          </span>
          <div>
            <h4 className="font-display text-lg font-bold text-ink">
              Ouça uma demonstração da narração
            </h4>
            <p className="text-xs font-semibold text-magic-600">
              Voz acolhedora e expressiva, perfeita para a hora de dormir
            </p>
          </div>
        </div>

        {/* Escolha do Tom de Voz */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-magic-50 p-1 border border-magic-100">
          <button
            type="button"
            onClick={() => {
              if (isPlaying && typeof window !== "undefined") window.speechSynthesis.cancel();
              setIsPlaying(false);
              setSelectedVoice("nova");
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
              selectedVoice === "nova"
                ? "bg-magic-600 text-white shadow"
                : "text-ink/70 hover:text-magic-700"
            }`}
          >
            👩 Tia Nova (Doce)
          </button>
          <button
            type="button"
            onClick={() => {
              if (isPlaying && typeof window !== "undefined") window.speechSynthesis.cancel();
              setIsPlaying(false);
              setSelectedVoice("fable");
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
              selectedVoice === "fable"
                ? "bg-magic-600 text-white shadow"
                : "text-ink/70 hover:text-magic-700"
            }`}
          >
            👨 Tio Fable (Animado)
          </button>
        </div>
      </div>

      {/* Frase de Exemplo & Player */}
      <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
        <button
          type="button"
          onClick={togglePlay}
          className={`flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-sm font-extrabold shadow-md transition-all active:scale-95 ${
            isPlaying
              ? "bg-coral-500 text-white shadow-coral-500/30 animate-pulse"
              : "bg-gradient-to-r from-sun-400 to-amber-500 text-ink shadow-sun-500/25 hover:brightness-105"
          }`}
        >
          <span>{isPlaying ? "⏸ Pausar Amostra" : "▶️ Ouvir História Agora"}</span>
        </button>

        <p className="text-sm italic text-ink/75 leading-relaxed bg-magic-50/60 p-3 rounded-2xl border border-magic-100/50 w-full">
          &ldquo;{sampleText}&rdquo;
        </p>
      </div>
    </div>
  );
}

