import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/catalog";
import MobileStickyBar from "@/components/MobileStickyBar";

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
  weight: ["500", "700", "800"],
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: `${BRAND.name} — Livro infantil personalizado com IA & Narração Real`,
    template: `%s | ${BRAND.name}`,
  },
  description:
    "Transforme seu filho no herói de um livro ilustrado mágico com a Coruja Lulu. História e ilustrações exclusivas a partir da foto da criança, com narração em voz humanizada. Veja a prévia 100% grátis!",
  openGraph: {
    images: ["/images/hero.webp"],
    locale: "pt_BR",
    type: "website",
    title: `${BRAND.name} — Livros infantis personalizados`,
    description: "Crie em 2 minutos um livro onde seu filho é o herói, com ilustrações lindas e narração com voz de conto de fadas.",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦉</text></svg>",
  },
};

export const viewport: Viewport = {
  themeColor: "#6b2cf5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${baloo.variable} ${nunito.variable}`}>
      <body className="min-h-screen font-sans antialiased bg-cream text-ink pb-14 sm:pb-0">
        {children}
        <MobileStickyBar />
      </body>
    </html>
  );
}
