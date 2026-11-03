import { Suspense } from "react";
import Header from "@/components/Header";
import Wizard from "./Wizard";

export const metadata = { title: "Criar meu livro" };

export default function CriarPage() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-gradient-to-b from-magic-50 to-cream">
        <Suspense fallback={<p className="p-10 text-center">Carregando…</p>}>
          <Wizard />
        </Suspense>
      </main>
    </>
  );
}
