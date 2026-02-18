alter table trades add column source text not null default 'manual';
alter table trades add column deleted_at timestamptz;
