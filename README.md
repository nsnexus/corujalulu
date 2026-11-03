# 📖 Era Uma Vez Eu — livros infantis personalizados com IA

Plataforma completa (Next.js 15 + Supabase + Cloudflare Workers) onde a criança vira a heroína de um livro ilustrado.

## ✨ O que já vem pronto

| Área | Recursos |
|---|---|
| **Landing page** | Hero animado, como funciona, 17 temas, valores, exemplos, estilos, preços, FAQ, CTA |
| **Assistente (5 passos)** | Criança (nome, idade, gênero, **foto**, aparência), turma (até 4 personagens: pessoa/pet/brinquedo), aventura + mensagem, estilo de ilustração + dedicatória, plano + dados. Rascunho salvo no navegador |
| **IA** | História pt-BR adaptada à idade (OpenAI, JSON estruturado), análise da foto → ficha do personagem, capa e páginas com `gpt-image` usando **foto + capa como referência** (consistência do personagem) |
| **Prévia grátis** | Título, sinopse, capa e página 1. Demais páginas bloqueadas (o texto nem chega ao navegador) |
| **Pagamento** | Mercado Pago Checkout Pro (Pix, cartão 12x, boleto), webhook com **assinatura HMAC validada**, conferência de valor e verificação ativa caso o webhook atrase |
| **Geração resiliente** | 1 imagem por chamada, lock atômico no banco, 3 tentativas por página, continua de onde parou se a aba fechar |
| **Leitor** | Livro com animação de página, swipe, teclado, tela cheia e **leitura em voz alta** (Web Speech API, sem custo) |
| **Entrega** | PDF gerado no navegador (pdf-lib), link mágico com prévia no WhatsApp (Open Graph), botão de compartilhar |
| **Minha estante** | Login sem senha (link mágico Supabase) e lista dos livros do e-mail |
| **Admin** | KPIs 30 dias (prévias, vendas, faturamento, conversão, falhas), busca/filtro, marcar como pago, reprocessar, refazer imagem de qualquer página |
| **LGPD** | Consentimento da foto, bucket privado, **foto apagada ao concluir**, livros com `noindex`, RLS no banco |

## 🗂️ Estrutura

```
src/
  app/
    page.tsx                  # landing
    criar/                    # assistente de criação
    livro/[id]/               # prévia → pagamento → ilustrando → leitor
    minha-estante/  entrar/   # área do cliente
    admin/                    # painel administrativo (+ server actions)
    api/books/                # POST cria livro
    api/books/[id]/step       # gera próxima imagem
    api/books/[id]/checkout   # cria pagamento
    api/webhooks/mercadopago  # confirmação de pagamento
  lib/
    catalog.ts                # ⭐ marca, preços, temas, valores, estilos (edite aqui)
    ai.ts                     # OpenAI (história, foto, imagens)
    books.ts                  # regras de negócio + motor de geração
    mercadopago.ts            # checkout + webhook
    pdf-client.ts             # PDF no navegador
supabase/schema.sql           # tabelas, RLS, funções e buckets
```

---

## 🚀 Passo a passo

### 1. Supabase
1. Crie um projeto em supabase.com.
2. **SQL Editor** → cole e execute `supabase/schema.sql`.
3. **Authentication → URL Configuration**
   - *Site URL*: `https://SEU-DOMINIO`
   - *Redirect URLs*: `https://SEU-DOMINIO/auth/callback` e `http://localhost:3000/auth/callback`
4. **Project Settings → API**: copie `URL`, `anon key` e `service_role key`.

### 2. OpenAI
Crie uma chave em platform.openai.com. Os modelos são configuráveis por variável (`OPENAI_TEXT_MODEL`, `OPENAI_IMAGE_MODEL`). Se o modelo de imagem não aceitar `input_fidelity`, deixe `IMAGE_INPUT_FIDELITY` vazio.

### 3. Mercado Pago
1. **Suas integrações → Criar aplicação** (Checkout Pro).
2. Copie o **Access Token** de produção (use o de teste enquanto valida).
3. **Webhooks** → URL `https://SEU-DOMINIO/api/webhooks/mercadopago`, evento **Pagamentos**. Copie a **assinatura secreta** → `MP_WEBHOOK_SECRET`.

### 4. Rodar localmente
```bash
npm install
cp .env.example .env.local      # preencha os valores
npm run dev                     # http://localhost:3000
```
> Para testar sem pagar, use `PAYMENTS_DISABLED=true` (nunca em produção).

### 5. GitHub
```bash
git init
git add .
git commit -m "Era Uma Vez Eu - versão inicial"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/era-uma-vez-eu.git
git push -u origin main
```

### 6. Cloudflare (Workers + OpenNext)
**Opção A — deploy automático pelo Git (recomendado)**
1. Cloudflare → **Workers & Pages → Create → Import a repository** → escolha o repositório.
2. *Build command*: `npx opennextjs-cloudflare build`
   *Deploy command*: `npx opennextjs-cloudflare deploy`
3. **Variáveis de build** (precisam existir no momento do build):
   `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Settings → Variables and Secrets** do Worker (runtime):
   - *Secrets*: `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`
   - *Texto*: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_EMAILS`, `IMAGE_INPUT_FIDELITY`
5. Adicione seu domínio em **Settings → Domains & Routes**.

**Opção B — pela sua máquina**
```bash
npx wrangler login
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put MP_ACCESS_TOKEN
npx wrangler secret put MP_WEBHOOK_SECRET
npm run deploy
```

> ⚠️ **Plano Workers Paid recomendado.** O plano Free tem limite de CPU muito baixo por requisição; decodificar e enviar as imagens geradas pode ultrapassá-lo.

---

## 🛠️ Personalização rápida
- **Nome, preços, temas, valores e estilos** → `src/lib/catalog.ts`
- **Cores e fontes** → `src/app/globals.css` (`@theme`)
- **Imagens da landing** → `public/images/`
- **Admin** → adicione e-mails em `ADMIN_EMAILS` e acesse `/admin` logado

## 🔐 Segurança e governança
- `service_role` só existe no servidor (`server-only`); o front só lê via RLS.
- Preço sempre definido no servidor; o webhook confere o valor pago.
- Entradas do usuário são sanitizadas antes de ir para a IA (mitiga *prompt injection*).
- Limite de 5 prévias não pagas por e-mail a cada 24h. Para mais proteção, ative **Cloudflare Turnstile** e **Rate Limiting Rules** em `/api/books`.
- Revise `Termos` e `Privacidade` com um profissional jurídico antes de publicar.

## 🗺️ Próximos passos sugeridos
- E-mail automático quando o livro fica pronto (Resend ou Supabase Edge Function).
- Livro impresso (capa dura) com integração de gráfica sob demanda.
- Cupom de desconto e upsell de 2º livro.
- Edição do texto pelo cliente antes de liberar.
