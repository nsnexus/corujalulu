import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BRAND } from "@/lib/catalog";

export const metadata = { title: "Termos de uso" };

export default function Termos() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-12 leading-relaxed [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold">
        <h1 className="font-display text-4xl font-extrabold">Termos de uso</h1>
        <p className="text-sm text-ink/50">Modelo inicial — revise com um profissional jurídico antes de publicar.</p>
        <h2>1. O serviço</h2>
        <p>O {BRAND.name} cria livros infantis digitais personalizados com auxílio de inteligência artificial, a partir das informações fornecidas pelo responsável.</p>
        <h2>2. Prévia e pagamento</h2>
        <p>A prévia (título, sinopse, capa e primeira página) é gratuita. O livro completo é liberado após a confirmação do pagamento via Mercado Pago.</p>
        <h2>3. Conteúdo gerado por IA</h2>
        <p>As ilustrações são criações artísticas inspiradas nas informações enviadas e podem apresentar variações. Caso alguma página não fique adequada, entre em contato para ajuste.</p>
        <h2>4. Uso permitido</h2>
        <p>O livro é para uso pessoal e familiar, podendo ser impresso e compartilhado. É proibida a revenda.</p>
        <h2>5. Responsabilidade do usuário</h2>
        <p>Ao enviar a foto, você declara ser responsável legal pela criança ou ter autorização dele(a).</p>
        <h2>6. Arrependimento</h2>
        <p>Por se tratar de produto digital personalizado e produzido sob encomenda, consulte nossa política de reembolso pelo atendimento.</p>
      </main>
      <Footer />
    </>
  );
}
