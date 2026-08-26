-- 在「旅跡 (lvji-travel)」這個 Supabase 專案的 SQL Editor 執行
-- 建立 asset-tracker 專用的資料表，表名與旅跡的表不同，兩個 App 共用同一個
-- 專案也不會互相干擾、互相覆蓋資料。

create table if not exists public.asset_tracker_snapshots (
  uid uuid primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- 開啟 Row Level Security，確保每個使用者只能讀寫自己的那一筆資料
alter table public.asset_tracker_snapshots enable row level security;

create policy "asset_tracker: select own row"
  on public.asset_tracker_snapshots for select
  using (auth.uid() = uid);

create policy "asset_tracker: insert own row"
  on public.asset_tracker_snapshots for insert
  with check (auth.uid() = uid);

create policy "asset_tracker: update own row"
  on public.asset_tracker_snapshots for update
  using (auth.uid() = uid)
  with check (auth.uid() = uid);
