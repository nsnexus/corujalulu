"use client";

import Link from "next/link";
import { BRAND } from "@/lib/catalog";

interface LuluLogoProps {
  light?: boolean;
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
  className?: string;
  href?: string;
}

/**
 * Logo profissional e mascote da Coruja Lulu em SVG vetorial de alta definição.
 * Totalmente responsivo, nítido em qualquer resolução (mobile/desktop).
 */
export function LuluIcon({ size = 44, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 hover:scale-105 ${className}`}
      aria-label="Mascote Coruja Lulu"
    >
      <defs>
        {/* Gradiente do Corpo */}
        <linearGradient id="lulu-body-grad" x1="20" y1="20" x2="100" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#581C87" />
        </linearGradient>

        {/* Gradiente da Máscara do Rosto */}
        <linearGradient id="lulu-face-grad" x1="30" y1="35" x2="90" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFDF7" />
          <stop offset="100%" stopColor="#F5EDDF" />
        </linearGradient>

        {/* Gradiente das Asas */}
        <linearGradient id="lulu-wing-grad" x1="10" y1="40" x2="40" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>

        {/* Gradiente do Livro */}
        <linearGradient id="lulu-book-grad" x1="38" y1="80" x2="82" y2="105" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Brilho Dourado das Estrelas / Óculos */}
        <linearGradient id="lulu-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Sombra suave interna */}
        <filter id="lulu-shadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#2e1065" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Halo de Luz Mágica Noturna */}
      <circle cx="60" cy="62" r="54" fill="#8B5CF6" fillOpacity="0.12" />

      {/* Orelhinhas / Penachos Superiores */}
      <path d="M30 42 C24 24 38 18 44 32 Z" fill="#6D28D9" />
      <path d="M90 42 C96 24 82 18 76 32 Z" fill="#6D28D9" />
      <path d="M32 38 C28 26 38 22 42 32 Z" fill="#F472B6" opacity="0.6" />
      <path d="M88 38 C92 26 82 22 78 32 Z" fill="#F472B6" opacity="0.6" />

      {/* Corpo Principal (Oval Fofa) */}
      <ellipse cx="60" cy="66" rx="44" ry="46" fill="url(#lulu-body-grad)" filter="url(#lulu-shadow)" />

      {/* Penugem da Barriguinha */}
      <ellipse cx="60" cy="74" rx="28" ry="30" fill="#EDE9FE" opacity="0.92" />
      {/* Escamas suaves de penas na barriga */}
      <path d="M50 72 Q60 78 70 72" stroke="#C4B5FD" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M45 80 Q55 86 65 80" stroke="#C4B5FD" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M55 80 Q65 86 75 80" stroke="#C4B5FD" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Máscara do Rosto (Dois Círculos Fundidos para os Olhinhos) */}
      <path
        d="M60 48 C50 34 32 34 26 48 C20 62 34 74 60 72 C86 74 100 62 94 48 C88 34 70 34 60 48 Z"
        fill="url(#lulu-face-grad)"
      />

      {/* Olho Esquerdo (Branco + Íris + Brilhos) */}
      <circle cx="43" cy="52" r="14" fill="#FFFFFF" />
      <circle cx="44" cy="52" r="9" fill="#2E1065" />
      <circle cx="42" cy="49" r="3.5" fill="#FFFFFF" />
      <circle cx="47" cy="55" r="1.5" fill="#F59E0B" />

      {/* Olho Direito (Branco + Íris + Brilhos) */}
      <circle cx="77" cy="52" r="14" fill="#FFFFFF" />
      <circle cx="76" cy="52" r="9" fill="#2E1065" />
      <circle cx="74" cy="49" r="3.5" fill="#FFFFFF" />
      <circle cx="79" cy="55" r="1.5" fill="#F59E0B" />

      {/* Óculos de Contadora de Histórias (Charme Intelectual & Afetuoso) */}
      <circle cx="43" cy="52" r="16.5" stroke="url(#lulu-gold)" strokeWidth="3" fill="none" />
      <circle cx="77" cy="52" r="16.5" stroke="url(#lulu-gold)" strokeWidth="3" fill="none" />
      <path d="M59.5 52 Q60 50 60.5 52" stroke="url(#lulu-gold)" strokeWidth="3" strokeLinecap="round" />

      {/* Biquinho Triângulo Dourado Acolhedor */}
      <path d="M56 61 L64 61 L60 69 Z" fill="#F59E0B" />
      <path d="M57 62 L63 62 L60 68 Z" fill="#FBBF24" />

      {/* Bochechinhas Rosadas Fofas */}
      <circle cx="28" cy="60" r="5" fill="#FB7185" opacity="0.45" />
      <circle cx="92" cy="60" r="5" fill="#FB7185" opacity="0.45" />

      {/* Asinha Esquerda */}
      <path
        d="M20 54 C12 66 14 84 28 88 C30 84 32 76 30 68 C28 60 24 56 20 54 Z"
        fill="url(#lulu-wing-grad)"
      />

      {/* Asinha Direita */}
      <path
        d="M100 54 C108 66 106 84 92 88 C90 84 88 76 90 68 C92 60 96 56 100 54 Z"
        fill="url(#lulu-wing-grad)"
      />

      {/* Livro Mágico Aberto na Frente */}
      <g transform="translate(36, 84)">
        {/* Páginas do Livro */}
        <path d="M3 4 C12 1 21 3 24 8 C27 3 36 1 45 4 L45 22 C36 19 27 21 24 24 C21 21 12 19 3 22 Z" fill="#FFFDF7" />
        {/* Capa Dourada */}
        <path d="M2 5 C12 2 21 4 24 9 C27 4 36 2 46 5 L46 23 C36 20 27 22 24 25 C21 22 12 20 2 23 Z" fill="url(#lulu-book-grad)" opacity="0.9" />
        <path d="M3 4 C12 1 21 3 24 8 C27 3 36 1 45 4 L45 21 C36 18 27 20 24 23 C21 20 12 18 3 21 Z" fill="#FFFDF7" />
        {/* Estrelinha no centro do livro */}
        <circle cx="24" cy="14" r="2.5" fill="#F59E0B" />
      </g>

      {/* Estrela Cadente / Centelha de Magia perto da Orelhinha */}
      <path
        d="M96 22 L98 27 L103 29 L98 31 L96 36 L94 31 L89 29 L94 27 Z"
        fill="#FBBF24"
      />
    </svg>
  );
}

export default function LuluLogo({
  light = false,
  size = "md",
  iconOnly = false,
  className = "",
  href = "/",
}: LuluLogoProps) {
  const iconSize = size === "sm" ? 36 : size === "lg" ? 54 : 44;
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-2xl";
  const badgeSize = size === "sm" ? "text-[10px]" : "text-xs";

  const Content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex-shrink-0">
        <LuluIcon size={iconSize} />
      </div>

      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-display font-black tracking-tight ${textSize} ${
                light ? "text-white" : "text-ink"
              }`}
            >
              Coruja Lulu
            </span>
            <span className="hidden sm:inline-block rounded-md bg-gradient-to-r from-amber-400 to-amber-500 px-1.5 py-0.5 font-display text-[10px] font-extrabold uppercase tracking-wide text-ink shadow-sm">
              IA ✨
            </span>
          </div>
          <span
            className={`font-sans font-bold tracking-tight ${badgeSize} ${
              light ? "text-amber-200/90" : "text-magic-600"
            }`}
          >
            Livros infantis mágicos
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center group">
        {Content}
      </Link>
    );
  }

  return Content;
}

