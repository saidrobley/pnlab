-- profiles
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- strategies
create table strategies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

alter table strategies enable row level security;

create policy "Users can view own strategies"
  on strategies for select using (auth.uid() = user_id);

create policy "Users can insert own strategies"
  on strategies for insert with check (auth.uid() = user_id);

create policy "Users can update own strategies"
  on strategies for update using (auth.uid() = user_id);

create policy "Users can delete own strategies"
  on strategies for delete using (auth.uid() = user_id);

-- trades
create table trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles on delete cascade,
  symbol text not null,
  direction text not null check (direction in ('long', 'short')),
  entry_price numeric not null,
  exit_price numeric,
  size numeric not null,
  pnl numeric,
  fees numeric default 0,
  strategy text,
  notes text,
  exchange text,
  opened_at timestamptz not null,
  closed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table trades enable row level security;

create policy "Users can view own trades"
  on trades for select using (auth.uid() = user_id);

create policy "Users can insert own trades"
  on trades for insert with check (auth.uid() = user_id);

create policy "Users can update own trades"
  on trades for update using (auth.uid() = user_id);

create policy "Users can delete own trades"
  on trades for delete using (auth.uid() = user_id);

-- indexes
create index trades_user_id_idx on trades (user_id);
create index trades_symbol_idx on trades (symbol);
create index trades_opened_at_idx on trades (opened_at);
create index trades_strategy_idx on trades (strategy);
