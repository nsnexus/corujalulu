import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BRAND } from "@/lib/catalog";

export const metadata = { title: "Política de privacidade" };

export default function Privacidade() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-12 leading-relaxed [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold">
        <h1 className="font-display text-4xl font-extrabold">Política de privacidade</h1>
        <p className="text-sm text-ink/50">Modelo inicial alinhado à LGPD — revise com um profissional jurídico antes de publicar.</p>
        <h2>Dados coletados</h2>
        <p>Nome e e-mail do responsável, WhatsApp (opcional), nome, idade e características da criança, e foto (opcional).</p>
        <h2>Finalidade</h2>
        <p>Os dados são usados exclusivamente para criar e entregar o livro personalizado e para comunicação sobre o pedido.</p>
        <h2>Foto da criança</h2>
        <p>A foto fica em armazenamento privado, é usada apenas para gerar as ilustrações e é <b>apagada automaticamente</b> quando o livro é concluído. Ela é enviada ao provedor de IA somente para esse processamento.</p>
        <h2>Compartilhamento</h2>
        <p>Usamos Supabase (armazenamento), OpenAI (geração de texto e imagens) e Mercado Pago (pagamentos). Não vendemos dados.</p>
        <h2>Acesso ao livro</h2>
        <p>O livro fica disponível por um link único e não é indexado por buscadores. Quem tiver o link poderá visualizá-lo.</p>
        <h2>Seus direitos</h2>
        <p>Você pode solicitar acesso, correção ou exclusão dos seus dados e do livro a qualquer momento pelo atendimento do {BRAND.name}.</p>
      </main>
      <Footer />
    </>
  );
}
