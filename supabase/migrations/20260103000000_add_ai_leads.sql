create table if not exists public.ai_leads (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  name text not null,
  email text not null,
  phone text null,
  company text null,
  agent text null,
  message text null,
  status text not null default 'new',
  constraint ai_leads_pkey primary key (id)
);

alter table public.ai_leads enable row level security;

create policy "Allow public inserts" on public.ai_leads
  for insert
  with check (true);

create policy "Allow specific user to view" on public.ai_leads
  for select
  using (
    auth.jwt() ->> 'email' = 'duku@constantinmedia.ro'
  );

create policy "Allow specific user to update" on public.ai_leads
  for update
  using (
    auth.jwt() ->> 'email' = 'duku@constantinmedia.ro'
  );
