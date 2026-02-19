create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  trades text,
  created_at timestamptz default now()
);

alter table waitlist enable row level security;

-- Allow anonymous inserts
create policy "Anyone can join waitlist"
  on waitlist for insert
  to anon, authenticated
  with check (true);

-- Allow anonymous select (for count queries)
create policy "Anyone can count waitlist"
  on waitlist for select
  to anon, authenticated
  using (true);
