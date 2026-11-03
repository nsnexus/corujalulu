"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PLANS } from "@/lib/catalog";
import { brl } from "@/lib/format";

export default function MobileStickyBar() {
  const [visible, setVisible] = useState(false);
  const minPrice = Math.min(...PLANS.map((p) => p.priceCents));

  useEffect(() => {
    const handleScroll = () => {
      // Aparece após rolar 260px (passando do início do hero)
      if (window.scrollY > 260) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <aside
      aria-label="Ação rápida para criar livro"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-magic-200/80 bg-white/95 px-4 py-3 shadow-[0_-8px_25px_rgba(46,16,101,0.15)] backdrop-blur-md transition-all duration-300 sm:hidden animate-page-in"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
            <span>⭐⭐⭐⭐⭐</span>
            <span className="text-ink/60">(4.9/5)</span>
          </div>
          <span className="font-display text-sm font-extrabold text-ink">
            A partir de {brl(minPrice)}
          </span>
          <span className="text-[10px] font-semibold text-emerald-600">
            ✓ Veja a capa grátis antes
          </span>
        </div>

        <Link
          href="/criar"
          className="flex-shrink-0 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-5 py-3 font-display text-sm font-black text-ink shadow-lg shadow-amber-400/30 transition-transform active:scale-95"
        >
          Criar Livro Grátis ✨
        </Link>
      </div>
    </aside>
  );
}

