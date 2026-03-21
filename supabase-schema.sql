-- ============================================================
-- KebAppen — Supabase Database Schema
-- Run this in: supabase.com → your project → SQL Editor
-- ============================================================

-- PLACES table (restaurants only — no type/meat here)
create table if not exists public.places (
  id          bigserial primary key,
  name        text not null,
  address     text,
  lat         double precision not null,
  lng         double precision not null,
  created_at  timestamptz default now()
);

-- RATINGS table (one row per user × place × combination)
create table if not exists public.ratings (
  id          bigserial primary key,
  place_id    bigint not null references public.places(id) on delete cascade,
  user_id     uuid  not null references auth.users(id) on delete cascade,
  type        text  not null check (type in ('pita','rull','tallerken')),
  meat        text  not null check (meat in ('storfe','kylling','lam','mix','svin')),
  bst         numeric(4,1) not null check (bst >= 0 and bst <= 10),
  bs          numeric(4,1) not null check (bs  >= 0 and bs  <= 10),
  bf          numeric(4,1) not null check (bf  >= 0 and bf  <= 10),
  bp          numeric(4,1) not null check (bp  >= 0 and bp  <= 10),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),

  -- One rating per user per combination per place
  unique (place_id, user_id, type, meat)
);

-- Auto-update updated_at on upsert
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger ratings_updated_at
  before update on public.ratings
  for each row execute function update_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.places  enable row level security;
alter table public.ratings enable row level security;

-- Places: anyone can read, only authenticated users can insert
create policy "places_select" on public.places for select using (true);
create policy "places_insert" on public.places for insert with check (auth.role() = 'authenticated');

-- Ratings: anyone can read, users can only insert/update their own
create policy "ratings_select" on public.ratings for select using (true);
create policy "ratings_insert" on public.ratings for insert with check (auth.uid() = user_id);
create policy "ratings_update" on public.ratings for update using (auth.uid() = user_id);

-- ============================================================
-- Seed data — 10 example places (restaurants only)
-- ============================================================
insert into public.places (name, address, lat, lng) values
  ('Kebab Palace',       'Grønlandsleiret 19, Oslo',      59.9093, 10.7638),
  ('Shawarma House',     'Torggata 11, Oslo',              59.9138, 10.7506),
  ('Istanbul Grill',     'Møllergata 22, Oslo',            59.9151, 10.7512),
  ('Råholt Kebab',       'Råholt Senter 3, Råholt',       60.2631, 11.2053),
  ('Sultan Kebab',       'Karl Johans gate 24, Oslo',      59.9127, 10.7408),
  ('Baba Grill',         'Thorvald Meyers gate 54, Oslo',  59.9231, 10.7567),
  ('Aker Brygge Babb',   'Stranden 3, Oslo',               59.9083, 10.7290),
  ('Majorstua Kebab',    'Bogstadveien 12, Oslo',          59.9283, 10.7161),
  ('Grønland Express',   'Grønland 8, Oslo',               59.9101, 10.7621),
  ('Kebab Bakeren',      'Prinsens gate 7, Oslo',          59.9107, 10.7453);
