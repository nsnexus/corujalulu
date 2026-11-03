"use client";

import Link from "next/link";
import type { Theme } from "@/lib/catalog";

interface ThemeBookCardProps {
  theme: Theme;
}

/**
 * Componente que renderiza um tema como uma capa real de livro infantil (estilo Hardcover 3D).
 * Elimina o aspecto amador de "ícone solto em card branco" e traz o encantamento de uma livraria infantil.
 */
export default function ThemeBookCard({ theme }: ThemeBookCardProps) {
  const hasImage = Boolean(theme.coverImage);

  return (
    <Link
      href={`/criar?tema=${theme.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl md:rounded-3xl border-2 border-magic-100/80 bg-magic-900 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-amber-400 active:scale-[0.98]"
    >
      {/* Proporção de livro infantil clássico (3:4) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-magic-800 via-magic-900 to-[#12072b]">
        {/* Efeito de Lombada de Livro Físico (Lado Esquerdo) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-3 md:w-4 bg-gradient-to-r from-black/60 via-white/30 to-transparent shadow-[1px_0_3px_rgba(0,0,0,0.4)]" />

        {/* Brilho de Capa Dura (Reflexo sutil diagonal) */}
        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/5 to-white/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Imagem de Capa Ilustrada */}
        {hasImage ? (
          <img
            src={theme.coverImage}
            alt={`Capa do livro tema ${theme.title}`}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Capa com Arte Vetorial Temática para temas personalizados */
          <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center">
            {/* Fundo Estelar Mágico */}
            <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-magic-500/30 via-transparent to-transparent" />
            <span className="text-6xl md:text-7xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
              {theme.emoji}
            </span>
            <div className="mt-4 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-amber-300 backdrop-blur-md">
              Ideia Livre ✦
            </div>
          </div>
        )}

        {/* Gradiente Escurecido Inferior para Leitura Perfeita do Título */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Selo / Badge no Topo da Capa */}
        <div className="absolute left-4 right-4 top-3 z-20 flex items-center justify-between">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] md:text-xs font-black uppercase tracking-wider text-magic-700 shadow-sm backdrop-blur-md">
            {theme.badge || "Livro Mágico"}
          </span>
          <span className="grid h-6 w-6 place-items-center rounded-full bg-black/40 text-xs text-amber-300 backdrop-blur-md">
            ★
          </span>
        </div>

        {/* Informações da Capa (Título, Sinopse e CTA) */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end p-4 md:p-5 text-white">
          <h3 className="font-display text-lg md:text-xl font-black leading-tight text-white drop-shadow-md group-hover:text-amber-300 transition-colors">
            {theme.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-xs text-white/80 leading-relaxed font-sans">
            {theme.desc}
          </p>

          <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-2.5">
            <span className="text-[11px] font-bold text-amber-300">
              {theme.ageTag || "0 a 10 anos"}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 font-display text-[11px] font-black text-ink shadow transition group-hover:bg-amber-300">
              <span>Personalizar</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

