-- =====================================================================
-- Segura-Link — schema inicial
-- Correr este ficheiro no Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- =====================================================================

-- Extensões necessárias
create extension if not exists "pgcrypto";

-- =====================================================================
-- 1. PROFILES (estende auth.users)
-- =====================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger para criar profile automaticamente quando user se regista
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- 2. INDIVIDUALS (entidades rastreadas)
-- =====================================================================
create table if not exists public.individuals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('person', 'vehicle', 'asset')),
  status text not null default 'inactive' check (status in ('active', 'inactive', 'warning', 'emergency')),
  color text not null default '#3b82f6',
  icon text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_individuals_owner on public.individuals(owner_id);

-- =====================================================================
-- 3. POSITIONS (histórico GPS)
-- =====================================================================
create table if not exists public.positions (
  id uuid primary key default gen_random_uuid(),
  individual_id uuid not null references public.individuals(id) on delete cascade,
  latitude double precision not null,
  longitude double precision not null,
  accuracy double precision not null,
  altitude double precision,
  altitude_accuracy double precision,
  heading double precision,
  speed double precision,
  recorded_at timestamptz not null default now()
);

create index if not exists idx_positions_individual_recorded on public.positions(individual_id, recorded_at desc);

-- =====================================================================
-- 4. SENSORS (sensores IoT)
-- =====================================================================
create table if not exists public.sensors (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('agriculture', 'security', 'geology')),
  status text not null default 'offline' check (status in ('active', 'warning', 'error', 'offline')),
  latitude double precision,
  longitude double precision,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_sensors_owner on public.sensors(owner_id);

-- =====================================================================
-- 5. SENSOR_READINGS (leituras dos sensores)
-- =====================================================================
create table if not exists public.sensor_readings (
  id uuid primary key default gen_random_uuid(),
  sensor_id uuid not null references public.sensors(id) on delete cascade,
  reading_type text not null check (reading_type in ('temperature', 'humidity', 'soil_moisture', 'motion')),
  value double precision not null,
  unit text not null,
  recorded_at timestamptz not null default now()
);

create index if not exists idx_readings_sensor_recorded on public.sensor_readings(sensor_id, recorded_at desc);

-- =====================================================================
-- 6. ALERTS
-- =====================================================================
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('error', 'warning', 'info', 'success')),
  title text not null,
  message text not null,
  related_sensor_id uuid references public.sensors(id) on delete set null,
  related_individual_id uuid references public.individuals(id) on delete set null,
  acknowledged boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_alerts_owner_created on public.alerts(owner_id, created_at desc);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================================
alter table public.profiles         enable row level security;
alter table public.individuals      enable row level security;
alter table public.positions        enable row level security;
alter table public.sensors          enable row level security;
alter table public.sensor_readings  enable row level security;
alter table public.alerts           enable row level security;

-- profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- individuals
drop policy if exists "individuals_all_own" on public.individuals;
create policy "individuals_all_own" on public.individuals
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- positions (acesso via individual)
drop policy if exists "positions_select_own" on public.positions;
create policy "positions_select_own" on public.positions
  for select using (
    exists (
      select 1 from public.individuals i
      where i.id = positions.individual_id and i.owner_id = auth.uid()
    )
  );

drop policy if exists "positions_insert_own" on public.positions;
create policy "positions_insert_own" on public.positions
  for insert with check (
    exists (
      select 1 from public.individuals i
      where i.id = positions.individual_id and i.owner_id = auth.uid()
    )
  );

-- sensors
drop policy if exists "sensors_all_own" on public.sensors;
create policy "sensors_all_own" on public.sensors
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- sensor_readings (acesso via sensor)
drop policy if exists "readings_select_own" on public.sensor_readings;
create policy "readings_select_own" on public.sensor_readings
  for select using (
    exists (
      select 1 from public.sensors s
      where s.id = sensor_readings.sensor_id and s.owner_id = auth.uid()
    )
  );

drop policy if exists "readings_insert_own" on public.sensor_readings;
create policy "readings_insert_own" on public.sensor_readings
  for insert with check (
    exists (
      select 1 from public.sensors s
      where s.id = sensor_readings.sensor_id and s.owner_id = auth.uid()
    )
  );

-- alerts
drop policy if exists "alerts_all_own" on public.alerts;
create policy "alerts_all_own" on public.alerts
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- =====================================================================
-- REALTIME (para subscrições em tempo real)
-- =====================================================================
alter publication supabase_realtime add table public.positions;
alter publication supabase_realtime add table public.sensor_readings;
alter publication supabase_realtime add table public.alerts;
