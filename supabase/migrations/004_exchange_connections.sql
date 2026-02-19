-- exchange_connections table
create table exchange_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles on delete cascade,
  exchange text not null default 'hyperliquid',
  wallet_address text not null,
  sync_period text not null default '30d'
    check (sync_period in ('7d','30d','90d','180d')),
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  unique(user_id, exchange)
);

alter table exchange_connections enable row level security;

create policy "Users can view own connections"
  on exchange_connections for select using (auth.uid() = user_id);

create policy "Users can insert own connections"
  on exchange_connections for insert with check (auth.uid() = user_id);

create policy "Users can update own connections"
  on exchange_connections for update using (auth.uid() = user_id);

create policy "Users can delete own connections"
  on exchange_connections for delete using (auth.uid() = user_id);

-- Add source_id to trades for exact deduplication (stores Hyperliquid tid)
alter table trades add column source_id text;
create index trades_source_source_id_idx on trades (source, source_id) where source_id is not null;
