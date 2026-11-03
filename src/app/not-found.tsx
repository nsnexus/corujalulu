import Link from "next/link";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="grid min-h-[70vh] place-items-center px-4 text-center">
        <div>
          <div className="text-7xl">🗺️</div>
          <h1 className="mt-4 font-display text-4xl font-extrabold">Essa página se perdeu na floresta</h1>
          <Link href="/" className="btn-primary mt-8">Voltar ao início</Link>
        </div>
      </main>
    </>
  );
}
