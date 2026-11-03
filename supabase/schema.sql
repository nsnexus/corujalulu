-- =====================================================================
-- Era Uma Vez Eu — schema Supabase
-- Execute no SQL Editor do Supabase (uma única vez)
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------- LIVROS ----------
create table if not exists public.books (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  status          text not null default 'draft'
                  check (status in ('draft','preview_ready','awaiting_payment','paid','generating','ready','failed')),

  -- quem comprou
  user_id         uuid references auth.users(id) on delete set null,
  buyer_name      text not null,
  buyer_email     text not null,
  buyer_whatsapp  text,

  -- plano / preço (definido no servidor)
  plan_id         text not null,
  price_cents     integer not null,
  pages_total     integer not null,
  pages_done      integer not null default 0,

  -- personalização
  child           jsonb not null,           -- nome, idade, gênero, aparência...
  companions      jsonb not null default '[]'::jsonb,
  theme_id        text not null,
  custom_idea     text,
  value_id        text not null,
  style_id        text not null,
  dedication      text,
  photo_path      text,                     -- caminho no bucket privado (apagado ao concluir)

  -- história gerada
  title           text,
  synopsis        text,
  character_sheet text,
  cover_prompt    text,
  cover_url       text,
  cover_attempts  integer not null default 0,

  -- pagamento
  mp_preference_id text,
  mp_payment_id    text,
  paid_at          timestamptz,
  ready_at         timestamptz,

  -- controle de processamento
  locked_until    timestamptz,
  error           text
);

create index if not exists books_email_idx   on public.books (lower(buyer_email));
create index if not exists books_status_idx  on public.books (status);
create index if not exists books_created_idx on public.books (created_at desc);

-- ---------- PÁGINAS ----------
create table if not exists public.book_pages (
  id           uuid primary key default gen_random_uuid(),
  book_id      uuid not null references public.books(id) on delete cascade,
  page_number  integer not null,
  text         text not null,
  scene        text not null,
  image_url    text,
  status       text not null default 'pending' check (status in ('pending','done','failed')),
  attempts     integer not null default 0,
  updated_at   timestamptz not null default now(),
  unique (book_id, page_number)
);

create index if not exists book_pages_book_idx on public.book_pages (book_id, page_number);

-- ---------- PAGAMENTOS ----------
create table if not exists public.payments (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  book_id      uuid not null references public.books(id) on delete cascade,
  provider     text not null default 'mercadopago',
  provider_id  text not null unique,
  status       text not null,
  amount_cents integer not null,
  method       text,
  raw          jsonb
);

-- ---------- updated_at automático ----------
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

drop trigger if exists books_touch on public.books;
create trigger books_touch before update on public.books
for each row execute function public.touch_updated_at();

drop trigger if exists pages_touch on public.book_pages;
create trigger pages_touch before update on public.book_pages
for each row execute function public.touch_updated_at();

-- ---------- Lock atômico p/ geração (evita gerar a mesma imagem 2x) ----------
create or replace function public.acquire_book_lock(p_id uuid, p_seconds int default 150)
returns boolean language plpgsql security definer set search_path = public as $$
declare ok boolean;
begin
  update public.books
     set locked_until = now() + make_interval(secs => p_seconds)
   where id = p_id
     and (locked_until is null or locked_until < now())
  returning true into ok;
  return coalesce(ok, false);
end $$;

create or replace function public.release_book_lock(p_id uuid)
returns void language sql security definer set search_path = public as $$
  update public.books set locked_until = null where id = p_id;
$$;

revoke all on function public.acquire_book_lock(uuid, int) from public, anon, authenticated;
revoke all on function public.release_book_lock(uuid) from public, anon, authenticated;

-- =====================================================================
-- RLS — o front só LÊ os livros do próprio usuário logado.
-- Toda escrita acontece no servidor com a service_role.
-- =====================================================================
alter table public.books      enable row level security;
alter table public.book_pages enable row level security;
alter table public.payments   enable row level security;

drop policy if exists "dono lê seus livros" on public.books;
create policy "dono lê seus livros" on public.books
for select to authenticated
using (
  user_id = auth.uid()
  or lower(buyer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

drop policy if exists "dono lê páginas" on public.book_pages;
create policy "dono lê páginas" on public.book_pages
for select to authenticated
using (exists (
  select 1 from public.books b
  where b.id = book_pages.book_id
    and (b.user_id = auth.uid() or lower(b.buyer_email) = lower(coalesce(auth.jwt() ->> 'email', '')))
    and b.status = 'ready'
));
-- payments: sem policy => ninguém lê pelo front (apenas service_role)

-- =====================================================================
-- STORAGE
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('book-images',  'book-images',  true,  10485760, array['image/jpeg','image/png','image/webp']),
  ('child-photos', 'child-photos', false, 8388608,  array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
-- book-images é público para leitura (link compartilhável/PDF).
-- child-photos é privado: só a service_role acessa. Fotos são apagadas ao concluir o livro.
