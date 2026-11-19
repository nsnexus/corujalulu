"use client";

import { useState } from "react";
import Link from "next/link";
import LuluLogo from "./LuluLogo";

const NAV = [
  ["#como-funciona", "Como funciona"],
  ["#temas", "Temas"],
  ["#narracao", "Narração IA 🎧"],
  ["#exemplos", "Exemplos"],
  ["#precos", "Preços"],
  ["#duvidas", "Dúvidas"],
];

/** Re-export para compatibilidade com outros componentes */
export function Logo({ light = false }: { light?: boolean }) {
  return <LuluLogo light={light} />;
}

export default function Header({ landing = false }: { landing?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-magic-100/70 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <LuluLogo />

        {/* Links Desktop */}
        {landing && (
          <nav className="hidden items-center gap-7 font-bold text-ink/75 lg:flex">
            {NAV.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="transition-colors hover:text-magic-600 active:scale-95"
              >
                {label}
              </a>
            ))}
          </nav>
        )}

        {/* Ações Desktop */}
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/minha-estante"
            className="rounded-full px-4 py-2 font-display text-sm font-bold text-ink/80 transition hover:bg-magic-100/60"
          >
            📚 Minha estante
          </Link>

          <Link
            href="/criar"
            className="btn-primary text-sm px-5 py-2.5 shadow-md shadow-magic-600/20"
          >
            Criar meu livro ✨
          </Link>
        </div>

        {/* Botão Mobile Hamburger & Ação Rápida */}
        <div className="flex items-center gap-2 sm:hidden">
          <Link
            href="/criar"
            className="rounded-full bg-gradient-to-r from-magic-600 to-magic-500 px-4 py-2 text-xs font-bold text-white shadow-sm"
          >
            Criar ✨
          </Link>

          {landing && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid h-10 w-10 place-items-center rounded-2xl border border-magic-200 bg-white text-ink shadow-sm transition active:scale-95"
              aria-label="Abrir menu"
            >
              <span className="text-xl">{mobileMenuOpen ? "✕" : "☰"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Menu Gaveta Mobile */}
      {landing && mobileMenuOpen && (
        <div className="border-b border-magic-200/80 bg-white/95 px-5 py-6 shadow-xl backdrop-blur-lg sm:hidden animate-page-in">
          <nav className="flex flex-col gap-3 font-display text-base font-bold text-ink">
            {NAV.map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2 text-ink/80 hover:bg-magic-50 hover:text-magic-600"
              >
                {label}
              </a>
            ))}

            <Link
              href="/minha-estante"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 rounded-xl border border-magic-100 bg-magic-50/50 px-3 py-2.5 text-magic-700"
            >
              📚 Acessar Minha Estante
            </Link>

            <Link
              href="/criar"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary mt-2 w-full text-center py-3 text-base"
            >
              Começar meu livro ✨
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
