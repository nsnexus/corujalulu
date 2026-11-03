/**
 * Catálogo da plataforma: marca, planos, temas, valores e estilos.
 * Edite aqui para mudar preços, textos e opções sem mexer no resto do código.
 */

export const BRAND = {
  name: "Coruja Lulu",
  tagline: "Livros infantis mágicos e personalizados onde seu pequeno é o herói",
  mascot: "Coruja Lulu",
  emoji: "🦉",
  whatsappSupport: "", // ex.: "5594999999999" (opcional, aparece no rodapé)
  instagram: "",
};

export interface Plan {
  id: string;
  name: string;
  pages: number;
  priceCents: number;
  fromCents?: number; // preço "de" (riscado)
  highlight?: boolean;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: "essencial",
    name: "Aventura Mágica",
    pages: 10,
    priceCents: 3990,
    fromCents: 7990,
    features: [
      "Prévia grátis com capa antes de pagar ✨",
      "Capa + 10 páginas ilustradas com IA",
      "Personagem inspirado na foto da criança",
      "Até 4 companheiros (família, pet ou brinquedo)",
      "Narração com voz humanizada no leitor 🎧",
      "PDF em alta resolução para imprimir 📄",
      "Link mágico para compartilhar no WhatsApp 📲",
    ],
  },
  {
    id: "encantado",
    name: "Aventura Encantada",
    pages: 16,
    priceCents: 5990,
    fromCents: 11990,
    highlight: true,
    features: [
      "Prévia grátis com capa antes de pagar ✨",
      "Capa + 16 páginas ilustradas (história completa)",
      "Enredo aprofundado com mais cenas e diálogos",
      "Personagem inspirado na foto da criança",
      "Até 4 companheiros (família, pet ou brinquedo)",
      "Narração humanizada (Tia Nova & Tio Fable) 🎧",
      "PDF pronto para gráfica ou impressão caseira 📄",
      "Link mágico + estante digital vitalícia 📚",
    ],
  },
];

export interface Theme {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  hint: string; // orientação para a IA
  coverImage?: string;
  badge?: string;
  ageTag?: string;
}

export const THEMES: Theme[] = [
  {
    id: "custom",
    emoji: "✨",
    title: "Nova História (Ideia Livre)",
    desc: "Descreva a sua própria aventura e a Coruja Lulu ilustra e escreve tudo do zero.",
    hint: "",
    coverImage: "/images/tema-minha-ideia.jpg",
    badge: "Criar do Zero ✦",
    ageTag: "Qualquer idade",
  },
  {
    id: "floresta",
    emoji: "🌳",
    title: "Floresta Encantada",
    desc: "Árvores mágicas, vaga-lumes e criaturas amigas.",
    hint: "uma floresta encantada com árvores falantes, vaga-lumes e animais amigos",
    coverImage: "/images/exemplo-floresta.webp",
    badge: "Mais Amado ⭐",
    ageTag: "3–6 anos",
  },
  {
    id: "espaco",
    emoji: "🚀",
    title: "Viagem ao Espaço",
    desc: "Foguetes, planetas coloridos e estrelas cadentes.",
    hint: "uma viagem espacial por planetas coloridos, com foguete e um robô amigo",
    coverImage: "/images/exemplo-espaco.webp",
    badge: "Aventura 🚀",
    ageTag: "5–9 anos",
  },
  {
    id: "fundo-do-mar",
    emoji: "🐠",
    title: "Fundo do Mar",
    desc: "Tartarugas marinhas, recifes de corais e tesouros.",
    hint: "uma aventura submarina entre corais, tartarugas, baleias e um tesouro",
    coverImage: "/images/tema-fundo-do-mar.jpg",
    badge: "Novo ✨",
    ageTag: "2–7 anos",
  },
  {
    id: "dinossauros",
    emoji: "🦕",
    title: "Mundo dos Dinossauros",
    desc: "Uma expedição carinhosa ao vale dos dinos amigos.",
    hint: "um vale pré-histórico com dinossauros gentis e engraçados",
    coverImage: "/images/tema-dinossauros.jpg",
    badge: "Sucesso 🦕",
    ageTag: "3–8 anos",
  },
  {
    id: "reino",
    emoji: "👑",
    title: "Reino Encantado",
    desc: "Castelos de conto de fadas e dragões gentis.",
    hint: "um reino encantado com castelo, dragão amigo e uma missão nobre",
    coverImage: "/images/tema-reino.jpg",
    badge: "Mágico 👑",
    ageTag: "3–8 anos",
  },
  {
    id: "super-heroi",
    emoji: "🦸",
    title: "Pequeno Super-Herói",
    desc: "Poderes de gentileza para proteger a cidade.",
    hint: "a criança descobre um superpoder gentil e ajuda a cidade",
    coverImage: "/images/tema-super-heroi.jpg",
    badge: "Inspirador ⚡",
    ageTag: "4–9 anos",
  },
  {
    id: "dormir",
    emoji: "🌙",
    title: "Hora de Dormir",
    desc: "Uma história calminha com a lua para ninar.",
    hint: "uma história tranquila de hora de dormir, com a lua e as estrelas, ritmo calmo",
    coverImage: "/images/tema-dormir.jpg",
    badge: "Ritual do Sono 💤",
    ageTag: "0–4 anos",
  },
  {
    id: "natal",
    emoji: "🎄",
    title: "Natal Mágico",
    desc: "Papai Noel, renas e a noite do amor.",
    hint: "uma noite de Natal mágica com o Papai Noel, renas, neve e gentileza",
    coverImage: "/images/exemplo-natal.webp",
    badge: "Especial 🎅",
    ageTag: "0–8 anos",
  },
  {
    id: "aniversario",
    emoji: "🎂",
    title: "Meu Aniversário",
    desc: "Uma festa inesquecível onde a criança é a estrela.",
    hint: "o aniversário da criança, uma festa mágica cheia de surpresas",
    coverImage: "/images/tema-aniversario.jpg",
    badge: "Celebração 🎉",
    ageTag: "1–10 anos",
  },
  {
    id: "fazendinha",
    emoji: "🐮",
    title: "Fazendinha Divertida",
    desc: "Bichinhos, horta fresca e alegria no campo.",
    hint: "uma fazendinha com animais divertidos, horta e nascer do sol",
    coverImage: "/images/tema-fazendinha.jpg",
    badge: "Alegre 🚜",
    ageTag: "1–5 anos",
  },
  {
    id: "futebol",
    emoji: "⚽",
    title: "Craque do Futebol",
    desc: "Gols, amizade e espírito de equipe no gramado.",
    hint: "um campeonato de futebol, trabalho em equipe e espírito esportivo",
    coverImage: "/images/tema-futebol.jpg",
    badge: "Esporte ⚽",
    ageTag: "5–10 anos",
  },
];

export interface Value {
  id: string;
  label: string;
  emoji: string;
}

export const VALUES: Value[] = [
  { id: "coragem", label: "Coragem", emoji: "🦁" },
  { id: "gentileza", label: "Gentileza", emoji: "💛" },
  { id: "amizade", label: "Amizade", emoji: "🤗" },
  { id: "autoestima", label: "Autoestima", emoji: "🌟" },
  { id: "diferencas", label: "Respeito às diferenças", emoji: "🌈" },
  { id: "paciencia", label: "Paciência", emoji: "🐢" },
  { id: "compartilhar", label: "Compartilhar", emoji: "🍪" },
  { id: "gratidao", label: "Gratidão", emoji: "🙏" },
  { id: "medos", label: "Vencer os medos", emoji: "🔦" },
  { id: "habitos", label: "Bons hábitos", emoji: "🪥" },
  { id: "responsabilidade", label: "Responsabilidade", emoji: "🧩" },
  { id: "familia", label: "Amor em família", emoji: "🏡" },
];

export interface Style {
  id: string;
  label: string;
  desc: string;
  prompt: string; // em inglês para o modelo de imagem
  previewImage: string;
  badge?: string;
  sampleDescription: string;
}

export const STYLES: Style[] = [
  {
    id: "3d",
    label: "Animação 3D",
    desc: "Como os filmes de cinema",
    prompt: "vibrant 3D animated movie style, soft global illumination, expressive big eyes, cute rounded shapes",
    previewImage: "/images/estilo-3d.webp",
    badge: "Mais Escolhido ⭐",
    sampleDescription: "Renderização 3D com iluminação suave, olhos grandes e expressivos e acabamento cinematográfico (estilo Pixar e Disney moderno).",
  },
  {
    id: "aquarela",
    label: "Aquarela",
    desc: "Delicado e artesanal",
    prompt: "soft watercolor children's book illustration, gentle textured paper, warm pastel palette, hand-painted look",
    previewImage: "/images/estilo-aquarela.webp",
    badge: "Artesanal 🎨",
    sampleDescription: "Pintura suave em aquarela sobre papel texturizado, tons pastéis aconchegantes e traços artísticos com toque feito à mão.",
  },
  {
    id: "cartoon",
    label: "Cartoon",
    desc: "Divertido e colorido",
    prompt: "bright 2D cartoon illustration, clean bold outlines, flat vibrant colors, playful and cheerful",
    previewImage: "/images/estilo-cartoon.jpg",
    badge: "Divertido 🖍️",
    sampleDescription: "Ilustração 2D alegre e cheia de energia, com contornos bem definidos, cores vibrantes e expressões divertidas.",
  },
  {
    id: "classico",
    label: "Livro Clássico",
    desc: "Ilustração conto de fadas",
    prompt: "classic storybook gouache illustration, rich warm colors, timeless fairy tale feel, detailed backgrounds",
    previewImage: "/images/estilo-classico.webp",
    badge: "Nostálgico 📖",
    sampleDescription: "Pintura em têmpera/gouache inspirada nos clássicos da literatura infantil, com riqueza de cenários e tons calorosos.",
  },
  {
    id: "kawaii",
    label: "Kawaii",
    desc: "Super fofo e meigo",
    prompt: "kawaii chibi illustration, super cute rounded characters, pastel colors, sparkles, adorable",
    previewImage: "/images/estilo-kawaii.jpg",
    badge: "Super Fofo 🌸",
    sampleDescription: "Estilo adorável com formas arredondadas, bochechinhas rosadas, olhos cintilantes e detalhes mágicos encantadores.",
  },
  {
    id: "massinha",
    label: "Massinha",
    desc: "Estilo claymation 3D",
    prompt: "claymation stop-motion style, handmade plasticine characters and sets, soft studio lighting",
    previewImage: "/images/estilo-massinha.jpg",
    badge: "Modelado 🧸",
    sampleDescription: "Visual modelado em plasticina artesanal (estilo massinha / stop-motion), com iluminação de estúdio e textura tátil.",
  },
];

export const AGE_LEVELS = [
  { max: 3, label: "0–3 anos", guide: "1 a 2 frases muito curtas por página, palavras simples, repetição e sons divertidos" },
  { max: 6, label: "4–6 anos", guide: "2 a 4 frases curtas por página, vocabulário simples, ritmo animado" },
  { max: 9, label: "7–9 anos", guide: "4 a 6 frases por página, diálogos curtos, um pouco de suspense" },
  { max: 99, label: "10+ anos", guide: "5 a 8 frases por página, narrativa mais rica, diálogos e reflexões" },
];

export const getPlan = (id: string) => PLANS.find((p) => p.id === id);
export const getTheme = (id: string) => THEMES.find((t) => t.id === id);
export const getValue = (id: string) => VALUES.find((v) => v.id === id);
export const getStyle = (id: string) => STYLES.find((s) => s.id === id);
export const ageGuide = (age: number) => AGE_LEVELS.find((a) => age <= a.max)!.guide;

export const MAX_COMPANIONS = 4;
