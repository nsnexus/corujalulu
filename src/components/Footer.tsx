import Link from "next/link";
import { BRAND } from "@/lib/catalog";
import LuluLogo from "./LuluLogo";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-magic-950 via-[#181033] to-[#110b24] text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        {/* Marca & Missão */}
        <div className="space-y-4 md:col-span-2">
          <LuluLogo light size="lg" />
          <p className="max-w-md text-sm text-white/75 leading-relaxed">
            {BRAND.tagline}. Com a ajuda da inteligência artificial e a sabedoria da <b>Coruja Lulu</b>, cada criança descobre que a maior magia do mundo já vive dentro do seu coração.
          </p>
          <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold text-amber-300">
            <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
              🛡️ Foto protegida pela LGPD
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
              🎧 Narração em Voz Humana
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
              ⚡ Prévia 100% Grátis
            </span>
          </div>
        </div>

        {/* Links rápidos */}
        <div className="space-y-3 text-sm">
          <p className="font-display text-base font-bold text-white">Navegação</p>
          <ul className="space-y-2 text-white/70">
            <li>
              <Link href="/criar" className="hover:text-amber-300 transition-colors">
                ✨ Criar Meu Livro
              </Link>
            </li>
            <li>
              <Link href="/minha-estante" className="hover:text-amber-300 transition-colors">
                📚 Minha Estante
              </Link>
            </li>
            <li>
              <a href="/#como-funciona" className="hover:text-amber-300 transition-colors">
                Como Funciona
              </a>
            </li>
            <li>
              <a href="/#precos" className="hover:text-amber-300 transition-colors">
                Preços e Planos
              </a>
            </li>
            <li>
              <a href="/#duvidas" className="hover:text-amber-300 transition-colors">
                Dúvidas Frequentes
              </a>
            </li>
          </ul>
        </div>

        {/* Segurança e Legal */}
        <div className="space-y-3 text-sm">
          <p className="font-display text-base font-bold text-white">Segurança & Suporte</p>
          <p className="text-xs text-white/60 leading-relaxed">
            Pagamentos criptografados via Mercado Pago. Pix com liberação imediata e cartão em até 12x.
          </p>
          {BRAND.whatsappSupport && (
            <a
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-emerald-300 ring-1 ring-white/15 hover:bg-white/20"
              href={`https://wa.me/${BRAND.whatsappSupport}`}
              target="_blank"
              rel="noreferrer"
            >
              <span>💬</span> Suporte via WhatsApp
            </a>
          )}
          <div className="flex flex-col gap-1 text-xs text-white/50 pt-1">
            <Link href="/termos" className="hover:underline">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="hover:underline">
              Política de Privacidade (LGPD)
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        <p>
          © {new Date().getFullYear()} <b>{BRAND.name}</b>. Todos os direitos reservados. Feito com carinho no Brasil 🇧🇷 🦉 💜
        </p>
      </div>
    </footer>
  );
}
