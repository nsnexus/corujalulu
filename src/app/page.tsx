import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AudioPreviewSample from "@/components/AudioPreviewSample";
import ThemeBookCard from "@/components/ThemeBookCard";
import StepIcon from "@/components/StepIcon";
import { LuluIcon } from "@/components/LuluLogo";
import { BRAND, PLANS, STYLES, THEMES, VALUES } from "@/lib/catalog";
import { brl } from "@/lib/format";

const STEPS = [
  {
    n: 1,
    tag: "01 · O Herói",
    title: "Conte sobre seu pequeno",
    text: "Nome, idade, jeitinho ou uma fotinho carinhosa. A Coruja Lulu desenha o personagem inspirado nele!",
    accent: "from-coral-500/10 to-transparent",
  },
  {
    n: 2,
    tag: "02 · Aventura",
    title: "Escolha tema & estilo",
    text: "Dinossauros, espaço, fazenda, reino... e o estilo de arte: animação 3D mágica, aquarela ou cartoon.",
    accent: "from-magic-500/10 to-transparent",
  },
  {
    n: 3,
    tag: "03 · Degustação",
    title: "Veja a prévia grátis",
    text: "A IA ilustra a capa oficial e o começo da história em ~1 minuto. Você folheia antes de pagar qualquer valor.",
    accent: "from-amber-500/10 to-transparent",
  },
  {
    n: 4,
    tag: "04 · Audiolivro",
    title: "História com voz humana",
    text: "Livro interativo que vira a página sozinho com a narração da Tia Nova ou Tio Fable, além de PDF para impressão.",
    accent: "from-emerald-500/10 to-transparent",
  },
];

const EXAMPLES = [
  {
    img: "/images/exemplo-floresta.webp",
    title: "Luna e o Segredo dos Vaga-lumes",
    tag: "Aquarela · 4–6 anos",
    text: "Luna e seu cachorrinho Biscoito descobrem que a floresta inteira brilha quando temos a coragem de pedir ajuda e abraçar um amigo.",
  },
  {
    img: "/images/exemplo-espaco.webp",
    title: "Theo e a Dança das Estrelas",
    tag: "Animação 3D · 7–9 anos",
    text: "Theo viaja em seu foguete de papelão pelo cosmos com o robozinho Blip para devolver uma estrela perdida de volta ao céu.",
  },
  {
    img: "/images/exemplo-natal.webp",
    title: "O Abraço de Neve de Bia",
    tag: "Cartoon · 0–3 anos",
    text: "Bia e o Ursinho Pipoca espalham pequenos gestos de carinho e risadas na noite mais mágica e quentinha do ano.",
  },
];

const TESTIMONIALS = [
  {
    name: "Mariana Silva",
    location: "São Paulo, SP",
    child: "Mãe do Bento (4 anos)",
    rating: 5,
    text: "O Bento ficou de queixo caído quando viu o rostinho dele desenhado no livro! E a narração com a voz da Tia Nova virou nosso ritual sagrado da hora de dormir. Nota mil!",
  },
  {
    name: "Rodrigo Meirelles",
    location: "Curitiba, PR",
    child: "Pai da Clara (6 anos)",
    rating: 5,
    text: "Achei incrível poder ver a capa antes de pagar. As ilustrações têm um capricho que parece filme da Pixar. Já mandei imprimir o PDF na gráfica para presentear os avós.",
  },
  {
    name: "Camila Nogueira",
    location: "Belo Horizonte, MG",
    child: "Tia do Lucas (3 anos)",
    rating: 5,
    text: "Melhor presente de aniversário disparado. O Lucas se sentiu um super-herói de verdade ao ver o cachorrinho dele participando da aventura!",
  },
];

const FAQ = [
  [
    "Preciso enviar foto da criança obrigatoriamente?",
    "Não é obrigatório! Sem foto, você apenas escolhe a cor do cabelo, formato, tom de pele e olhos da criança. Com foto, a IA analisa a fisionomia para criar o personagem ainda mais fiel e parecido.",
  ],
  [
    "A prévia é realmente 100% grátis?",
    "Sim! Você preenche os dados e vê o título gerado, a sinopse e a Capa Ilustrada Oficial sem pagar nada. Você só realiza o pagamento se gostar do resultado.",
  ],
  [
    "Como funciona a narração com voz humanizada?",
    "Ao abrir o leitor no celular ou computador, você pode ativar a 'Narração Mágica'. A história é lida com vozes acolhedoras e expressivas (Tia Nova ou Tio Fable) e as páginas viram sozinhas automaticamente conforme a leitura avança.",
  ],
  [
    "Como recebo o livro?",
    "Você recebe acesso imediato pelo link mágico do livro (que fica salvo na sua estante digital), com visualizador interativo em tela cheia e botão para baixar o PDF completo em alta resolução para imprimir em casa ou na gráfica.",
  ],
  [
    "E a privacidade da foto do meu filho (LGPD)?",
    "Segurança total! A foto é enviada para um servidor seguro criptografado e utilizada exclusivamente para orientar os traços do ilustrador de IA. Assim que o livro fica pronto, a foto original é apagada automaticamente do nosso armazenamento.",
  ],
  [
    "Quais as formas de pagamento?",
    "Pix instantâneo (com liberação em segundos), cartão de crédito em até 12x e boleto bancário, tudo processado com a segurança do Mercado Pago.",
  ],
];

export default function Home() {
  const minPrice = Math.min(...PLANS.map((p) => p.priceCents));

  return (
    <>
      <Header landing />

      {/* HERO SECTION DE ALTA CONVERSÃO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#140b2b] via-[#211147] to-magic-700 text-white">
        {/* Estrelinhas cintilantes */}
        <div className="pointer-events-none absolute inset-0 opacity-80">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className="absolute animate-twinkle text-sun-300 font-serif"
              style={{
                left: `${(i * 31) % 100}%`,
                top: `${(i * 47) % 95}%`,
                animationDelay: `${(i % 6) * 0.4}s`,
                fontSize: 10 + (i % 3) * 6,
              }}
            >
              ✦
            </span>
          ))}
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-12 lg:pt-16">
          {/* Lado Esquerdo: Proposta de Valor & CTAs */}
          <div className="space-y-6 lg:col-span-7">
            {/* Prova Social Rápida */}
            <div className="inline-flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold backdrop-blur-md ring-1 ring-white/20">
              <span className="flex text-amber-300">★★★★★</span>
              <span className="text-white/90">
                +2.400 famílias encantadas com a <b>Coruja Lulu</b>
              </span>
            </div>

            {/* Headline Principal */}
            <h1 className="font-display text-4xl font-black leading-[1.08] sm:text-5xl lg:text-6xl tracking-tight">
              Seu filho como o <span className="text-amber-400">herói</span> de um livro mágico com voz real
            </h1>

            {/* Subhead focado em benefícios */}
            <p className="max-w-xl text-base sm:text-lg text-white/85 leading-relaxed">
              Criamos em minutos uma história exclusiva onde o rostinho, o nome e os amiguinhos ganham vida em ilustrações encantadoras e <b>narração humanizada em áudio</b>.
            </p>

            {/* Micro garantias de conversão */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 text-xs sm:text-sm font-bold text-amber-200">
              <span className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5">
                <span>👁️</span> Veja a capa grátis
              </span>
              <span className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5">
                <span>🎧</span> Voz acolhedora inclusa
              </span>
              <span className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5">
                <span>⚡</span> Pronto em 2 minutos
              </span>
              <span className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5">
                <span>🛡️</span> Foto 100% protegida
              </span>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/criar"
                className="btn-sun text-center py-4 text-lg font-black shadow-xl shadow-amber-500/30"
              >
                <span>✨ Criar Livro Grátis Agora</span>
                <span className="text-xl">→</span>
              </Link>

              <a
                href="#narracao"
                className="flex items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-6 py-3.5 font-display text-base font-bold text-white transition hover:bg-white/20 active:scale-95"
              >
                <span>🎧</span> Ouvir Demonstração
              </a>
            </div>

            {/* Preço de Entrada */}
            <div className="pt-2 text-sm text-white/70">
              Sem mensalidades. Livro completo a partir de{" "}
              <b className="text-lg font-extrabold text-amber-300">{brl(minPrice)}</b> (ou até 12x no cartão).
            </div>
          </div>

          {/* Lado Direito: Mascote e Mockup Interativo */}
          <div className="relative lg:col-span-5 flex justify-center">
            {/* Glow de fundo */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-amber-400/30 via-magic-500/30 to-coral-400/20 blur-3xl" />

            <div className="relative w-full max-w-md animate-float">
              {/* Card visual do Livro */}
              <div className="overflow-hidden rounded-[2.5rem] border-4 border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">
                <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-magic-950">
                  <img
                    src="/images/hero.webp"
                    alt="Livro infantil mágico personalizado da Coruja Lulu"
                    className="h-full w-full object-cover"
                  />
                  {/* Badge Flutuante de Prévia */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md">
                    <div className="flex items-center gap-2.5">
                      <LuluIcon size={34} />
                      <div className="text-left leading-tight">
                        <p className="font-display text-xs font-black text-ink">
                          Coruja Lulu & Você
                        </p>
                        <p className="text-[10px] font-bold text-emerald-600">
                          ✓ Narração em Áudio Inclusa
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/criar"
                      className="rounded-full bg-magic-600 px-3.5 py-1.5 font-display text-xs font-extrabold text-white shadow transition hover:bg-magic-700"
                    >
                      Ver Prévia
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Onda Suave de Transição */}
        <div className="relative">
          <svg
            className="block w-full text-cream"
            viewBox="0 0 1440 90"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M0 40 C 360 110 1080 -10 1440 40 L1440 90 L0 90 Z" />
          </svg>
        </div>
      </section>

      {/* SEÇÃO 2: COMO FUNCIONA (4 PASSOS DESCOMPLICADOS) */}
      <section id="como-funciona" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-14 text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-magic-100 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-magic-700">
            🦉 Simples, Rápido & Sem Risco
          </div>
          <h2 className="section-title">Como a mágica acontece</h2>
          <p className="mx-auto max-w-xl text-ink/70 text-base sm:text-lg">
            Em menos tempo do que ler uma historinha de ninar, seu livro está pronto para encantar.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className={`card relative flex flex-col justify-between p-6 sm:p-7 border-2 border-magic-100/80 bg-gradient-to-b ${s.accent} via-white to-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-magic-300`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <StepIcon step={s.n} />
                  <span className="rounded-full bg-magic-100/70 px-3 py-1 font-display text-xs font-black text-magic-700">
                    {s.tag}
                  </span>
                </div>
                <h3 className="mb-2 font-display text-xl font-black text-ink">{s.title}</h3>
                <p className="text-sm text-ink/70 leading-relaxed font-sans">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/criar" className="btn-primary text-base px-8 py-3.5">
            Experimentar agora com a Coruja Lulu ✨
          </Link>
        </div>
      </section>

      {/* SEÇÃO 3: DESTAQUE PARA A NARRAÇÃO EM ÁUDIO HUMANIZADA */}
      <section id="narracao" className="bg-gradient-to-b from-magic-50 via-white to-magic-50 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-10 space-y-3">
            <span className="rounded-full bg-amber-100 px-4 py-1 text-xs font-black uppercase tracking-wider text-amber-800">
              🎧 Recurso Exclusivo
            </span>
            <h2 className="section-title">
              Histórias que ganham vida com <span className="text-magic-600">voz humanizada</span>
            </h2>
            <p className="mx-auto max-w-2xl text-ink/70">
              Chega de vozes de robô sem emoção! Na Coruja Lulu, cada página é narrada com o carinho, a doçura e as pausas teatrais que as crianças adoram antes de dormir.
            </p>
          </div>

          {/* Componente Interativo de Demonstração */}
          <AudioPreviewSample />

          <div className="mt-8 grid gap-4 sm:grid-cols-3 text-center">
            <div className="rounded-2xl bg-white p-4 border border-magic-100 shadow-sm">
              <span className="text-2xl">🌙</span>
              <h4 className="font-display font-bold text-ink mt-1">Hora de Dormir Calma</h4>
              <p className="text-xs text-ink/60 mt-1">O celular lê para a criança enquanto você ajeita as cobertas.</p>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-magic-100 shadow-sm">
              <span className="text-2xl">📖</span>
              <h4 className="font-display font-bold text-ink mt-1">Virada Automática</h4>
              <p className="text-xs text-ink/60 mt-1">A página vira sozinha assim que o narrador conclui a fala.</p>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-magic-100 shadow-sm">
              <span className="text-2xl">🎭</span>
              <h4 className="font-display font-bold text-ink mt-1">Vozes Diferentes</h4>
              <p className="text-xs text-ink/60 mt-1">Alterne entre a carinhosa Tia Nova ou o animado Tio Fable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: TEMAS MÁGICOS */}
      <section id="temas" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center space-y-3">
          <span className="rounded-full bg-magic-100 px-4 py-1 text-xs font-bold text-magic-700">
            🌳 O Mundo da Imaginação
          </span>
          <h2 className="section-title">Escolha a próxima aventura</h2>
          <p className="mx-auto max-w-xl text-ink/70">
            Temas lúdicos para todas as idades, reforçando valores de amor, coragem e empatia.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {THEMES.map((t) => (
            <ThemeBookCard key={t.id} theme={t} />
          ))}
        </div>

        {/* Pílulas de Valores */}
        <div className="mt-12 text-center">
          <p className="mb-4 font-display text-sm font-bold text-ink/70 uppercase tracking-wide">
            💛 Valores trabalhados nas histórias
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {VALUES.map((v) => (
              <span
                key={v.id}
                className="rounded-full border border-magic-200 bg-white px-4 py-1.5 text-xs font-bold text-ink shadow-sm"
              >
                {v.emoji} {v.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 5: EXEMPLOS E ESTILOS ILUSTRATIVOS */}
      <section id="exemplos" className="bg-magic-50/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 text-center space-y-3">
            <span className="rounded-full bg-magic-100 px-4 py-1 text-xs font-bold text-magic-700">
              🎨 Arte que emociona
            </span>
            <h2 className="section-title">Livros criados para guardar a vida toda</h2>
            <p className="mx-auto max-w-xl text-ink/60">
              Cada livro é gerado de forma única, com ilustrações vivas e consistentes.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {EXAMPLES.map((e) => (
              <article
                key={e.title}
                className="card overflow-hidden transition-all hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-magic-100">
                  <img
                    src={e.img}
                    alt={e.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-magic-700 shadow-sm backdrop-blur">
                    {e.tag}
                  </span>
                </div>
                <div className="space-y-2 p-6">
                  <h3 className="font-display text-xl font-bold text-ink">{e.title}</h3>
                  <p className="text-sm text-ink/70 leading-relaxed">{e.text}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Estilos de Arte */}
          <div className="mt-12 text-center">
            <p className="mb-4 font-display text-base font-bold text-ink">
              Estilos artísticos à sua escolha:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {STYLES.map((s) => (
                <span
                  key={s.id}
                  className="rounded-full border border-magic-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-ink shadow-sm"
                >
                  🎨 {s.label} ({s.desc})
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6: DEPOIMENTOS DE PAIS (PROVA SOCIAL) */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-14 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-1 text-xs font-black text-amber-800">
            <span>⭐⭐⭐⭐⭐</span> 4.9 de 5 baseado em +1.200 avaliações
          </div>
          <h2 className="section-title">O que dizem as famílias</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="card flex flex-col justify-between p-6 border-2 border-magic-100"
            >
              <div className="space-y-3">
                <div className="flex text-amber-400 text-sm">
                  {Array.from({ length: t.rating }).map((_, r) => (
                    <span key={r}>★</span>
                  ))}
                </div>
                <p className="text-sm text-ink/80 leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
              <div className="mt-6 border-t border-magic-100 pt-4">
                <p className="font-display text-base font-bold text-ink">{t.name}</p>
                <p className="text-xs font-semibold text-magic-600">{t.child}</p>
                <p className="text-[11px] text-ink/40">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO 7: TABELA DE PREÇOS (CONVERSÃO MÁXIMA) */}
      <section id="precos" className="bg-gradient-to-b from-magic-50 to-cream py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center space-y-3">
            <span className="rounded-full bg-emerald-100 px-4 py-1 text-xs font-extrabold text-emerald-800 uppercase tracking-wide">
              🔒 Sem Mensalidades · Pagamento Único
            </span>
            <h2 className="section-title">Escolha o tamanho da aventura</h2>
            <p className="text-ink/60">
              A prévia com a capa e o começo é 100% gratuita. Você só paga se gostar!
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {PLANS.map((p) => (
              <div
                key={p.id}
                className={`card relative flex flex-col justify-between p-8 transition-all ${p.highlight
                    ? "border-4 border-amber-400 shadow-2xl ring-4 ring-amber-400/20"
                    : "border-2 border-magic-200"
                  }`}
              >
                {p.highlight && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-1 font-display text-xs font-black uppercase tracking-wider text-ink shadow-md">
                    ⭐ Escolhido por 89% dos pais
                  </span>
                )}

                <div>
                  <h3 className="font-display text-2xl font-black text-ink">{p.name}</h3>

                  <div className="my-5">
                    {p.fromCents && (
                      <p className="text-sm font-semibold text-ink/40 line-through">
                        De {brl(p.fromCents)}
                      </p>
                    )}
                    <p className="font-display text-5xl font-black text-magic-700">
                      {brl(p.priceCents)}
                    </p>
                    <p className="mt-1 text-xs font-bold text-emerald-600">
                      ✓ Pagamento único · ou em até 12x no cartão
                    </p>
                  </div>

                  <ul className="mb-8 space-y-2.5 text-sm text-ink/80">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/criar?plano=${p.id}`}
                  className={`w-full text-center py-4 text-base font-extrabold ${p.highlight ? "btn-sun" : "btn-primary"
                    }`}
                >
                  Começar Prévia Grátis ✨
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-ink/60">
            <span>🛡️ Garantia de Satisfação</span>
            <span>⚡ Pix com liberação imediata</span>
            <span>💳 Cartão de Crédito em 12x</span>
          </div>
        </div>
      </section>

      {/* SEÇÃO 8: PERGUNTAS FREQUENTES (FAQ) */}
      <section id="duvidas" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="mb-10 text-center space-y-2">
          <h2 className="section-title">Perguntas frequentes</h2>
          <p className="text-ink/60 text-sm">Tudo o que você precisa saber antes de criar seu livro.</p>
        </div>

        <div className="space-y-3.5">
          {FAQ.map(([q, a], idx) => (
            <details
              key={idx}
              className="card group p-5 [&_summary::-webkit-details-marker]:hidden border border-magic-200"
            >
              <summary className="flex cursor-pointer items-center justify-between font-display text-base sm:text-lg font-bold text-ink">
                <span>{q}</span>
                <span className="text-magic-600 transition-transform duration-200 group-open:rotate-45 text-xl">
                  ＋
                </span>
              </summary>
              <p className="mt-3 text-sm text-ink/75 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* SEÇÃO 9: BANNER FINAL DE CONVERSÃO */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 text-center">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-magic-800 via-magic-600 to-coral-500 p-8 sm:p-14 text-white shadow-2xl">
          <div className="relative z-10 space-y-4">
            <span className="text-5xl animate-bounce inline-block">🦉</span>
            <h2 className="font-display text-3xl font-black sm:text-5xl">
              Pronto para ver o rostinho do seu filho brilhar?
            </h2>
            <p className="mx-auto max-w-lg text-base sm:text-lg text-white/90">
              Leva menos de 2 minutos. Crie agora e receba a prévia exclusiva da capa com a Coruja Lulu!
            </p>
            <div className="pt-4">
              <Link
                href="/criar"
                className="btn-sun inline-flex text-lg px-8 py-4 shadow-2xl shadow-amber-400/50"
              >
                Começar Livro Mágico Grátis ✨
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
