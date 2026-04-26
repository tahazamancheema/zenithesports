-- ─────────────────────────────────────────
-- ZENITH ESPORTS SUPABASE SCHEMA (IDEMPOTENT)
-- ─────────────────────────────────────────
-- You can run this script multiple times safely.
-- It will add missing columns and update functions without deleting data.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS TABLE
create table if not exists public.users (
  id uuid references auth.users not null primary key,
  email text,
  role text default 'user',
  display_name text,
  team_name text,
  logo_url text,
  whatsapp_number text,
  city text,
  player_ids text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TOURNAMENTS TABLE
create table if not exists public.tournaments (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  start_date timestamp with time zone,
  registration_deadline timestamp with time zone,
  status text default 'upcoming',
  max_teams integer default 64,
  prize_pool text,
  game text default 'PUBG Mobile',
  poster_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add missing columns to tournaments if they don't exist
alter table public.tournaments add column if not exists registration_open_date timestamp with time zone;
alter table public.tournaments add column if not exists is_completed boolean default false;
alter table public.tournaments add column if not exists briefing text;
alter table public.tournaments add column if not exists schedule jsonb default '[]';
alter table public.tournaments add column if not exists roadmap jsonb default '[]';

-- 3. REGISTRATIONS TABLE
create table if not exists public.registrations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  tournament_id uuid references public.tournaments(id) on delete cascade not null,
  team_name text not null,
  logo_url text,
  whatsapp_number text not null,
  city text,
  player_ids text[] not null,
  status text default 'pending', -- pending, approved, rejected
  group_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add missing columns to registrations if they don't exist
alter table public.registrations add column if not exists real_name text;

-- ─────────────────────────────────────────
-- SECURITY (Row Level Security)
-- ─────────────────────────────────────────

alter table public.users enable row level security;
alter table public.tournaments enable row level security;
alter table public.registrations enable row level security;

-- Admin bypass function
create or replace function public.is_admin()
returns boolean
language sql security definer set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ─────────────────────────────────────────
-- POLICIES (Drop and Create for idempotency)
-- ─────────────────────────────────────────

-- USERS
drop policy if exists "Users can view their own profile." on public.users;
create policy "Users can view their own profile." on public.users for select using (auth.uid() = id);

drop policy if exists "Admins can view all profiles." on public.users;
create policy "Admins can view all profiles." on public.users for select using (public.is_admin());

drop policy if exists "Users can update their own profile." on public.users;
create policy "Users can update their own profile." on public.users for update using (auth.uid() = id);

-- TOURNAMENTS
drop policy if exists "Tournaments are viewable by everyone." on public.tournaments;
create policy "Tournaments are viewable by everyone." on public.tournaments for select using (true);

drop policy if exists "Admins can insert tournaments." on public.tournaments;
create policy "Admins can insert tournaments." on public.tournaments for insert with check (public.is_admin());

drop policy if exists "Admins can update tournaments." on public.tournaments;
create policy "Admins can update tournaments." on public.tournaments for update using (public.is_admin());

drop policy if exists "Admins can delete tournaments." on public.tournaments;
create policy "Admins can delete tournaments." on public.tournaments for delete using (public.is_admin());

-- REGISTRATIONS
drop policy if exists "Users can view their own registrations." on public.registrations;
create policy "Users can view their own registrations." on public.registrations for select using (auth.uid() = user_id);

drop policy if exists "Anyone can read registrations (for duplication checks)." on public.registrations;
create policy "Anyone can read registrations (for duplication checks)." on public.registrations for select using (true);

drop policy if exists "Users can insert their own registrations." on public.registrations;
create policy "Users can insert their own registrations." on public.registrations for insert with check (auth.uid() = user_id);

drop policy if exists "Admins can update all registrations." on public.registrations;
create policy "Admins can update all registrations." on public.registrations for update using (public.is_admin());

drop policy if exists "Users can update their own pending registrations." on public.registrations;
create policy "Users can update their own pending registrations." on public.registrations for update using (auth.uid() = user_id and status = 'pending');

-- ─────────────────────────────────────────
-- TRIGGERS & FUNCTIONS
-- ─────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, display_name)
  values (new.id, new.email, new.raw_user_meta_data->>'displayName');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────
-- STORAGE SETUP
-- ─────────────────────────────────────────

-- Create buckets if they don't exist
insert into storage.buckets (id, name, public)
values ('ze-posters', 'ze-posters', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('ze-logos', 'ze-logos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('ze-proofs', 'ze-proofs', true)
on conflict (id) do nothing;

-- ─────────────────────────────────────────
-- STORAGE POLICIES
-- ─────────────────────────────────────────

-- Posters
drop policy if exists "Anyone can view posters" on storage.objects;
create policy "Anyone can view posters" on storage.objects for select using (bucket_id = 'ze-posters');

drop policy if exists "Admins can deploy posters" on storage.objects;
create policy "Admins can deploy posters" on storage.objects for insert with check (bucket_id = 'ze-posters' AND public.is_admin());

drop policy if exists "Admins can alter posters" on storage.objects;
create policy "Admins can alter posters" on storage.objects for update using (bucket_id = 'ze-posters' AND public.is_admin());

drop policy if exists "Admins can purge posters" on storage.objects;
create policy "Admins can purge posters" on storage.objects for delete using (bucket_id = 'ze-posters' AND public.is_admin());

-- Logos
drop policy if exists "Anyone can view team logos" on storage.objects;
create policy "Anyone can view team logos" on storage.objects for select using (bucket_id = 'ze-logos');

drop policy if exists "Authenticated users can upload logos" on storage.objects;
create policy "Authenticated users can upload logos" on storage.objects for insert with check (bucket_id = 'ze-logos' AND auth.role() = 'authenticated');

drop policy if exists "Users can update their own logos" on storage.objects;
create policy "Users can update their own logos" on storage.objects for update using (bucket_id = 'ze-logos' AND auth.uid() = owner);

drop policy if exists "Admins can delete any logos" on storage.objects;
create policy "Admins can delete any logos" on storage.objects for delete using (bucket_id = 'ze-logos' AND public.is_admin());

-- Proofs (Registration Screenshots)
drop policy if exists "Anyone can view proofs" on storage.objects;
create policy "Anyone can view proofs" on storage.objects for select using (bucket_id = 'ze-proofs');

drop policy if exists "Authenticated users can upload proofs" on storage.objects;
create policy "Authenticated users can upload proofs" on storage.objects for insert with check (bucket_id = 'ze-proofs' AND auth.role() = 'authenticated');

drop policy if exists "Admins can delete any proofs" on storage.objects;
create policy "Admins can delete any proofs" on storage.objects for delete using (bucket_id = 'ze-proofs' AND public.is_admin());

-- ─────────────────────────────────────────
-- RPC FUNCTIONS
-- ─────────────────────────────────────────

create or replace function public.get_total_users()
returns integer
language sql
security definer
as $$
  select count(*)::integer from public.users;
$$;
