-- BARON JOBS - ONE-TIME SUPABASE DATABASE SETUP
-- Run this in Supabase > SQL Editor for the Baron Corporation project.

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  employer_name text not null,
  location_city text not null,
  location_state text not null,
  workplace_type text,
  employment_type text,
  category text,
  experience_level text,
  compensation_text text,
  summary text,
  description text not null,
  keywords text,
  responsibilities text[] default '{}',
  requirements text[] default '{}',
  benefits text[] default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete restrict,
  job_title_snapshot text not null,
  user_id uuid null references auth.users(id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  city text not null,
  state text not null,
  years_experience integer,
  recent_job_title text,
  certification text,
  availability text,
  professional_summary text not null,
  additional_info text,
  consent boolean not null default false,
  review_status text not null default 'waiting_review',
  created_at timestamptz not null default now()
);

create index if not exists jobs_active_created_idx on public.jobs(is_active, created_at desc);
create index if not exists jobs_title_idx on public.jobs(title);
create index if not exists jobs_state_idx on public.jobs(location_state);
create index if not exists applications_created_idx on public.applications(created_at desc);
create index if not exists applications_job_idx on public.applications(job_id);

alter table public.jobs enable row level security;
alter table public.applications enable row level security;

drop policy if exists "Public can read active jobs" on public.jobs;
create policy "Public can read active jobs" on public.jobs
for select to anon, authenticated
using (is_active = true or (auth.jwt() ->> 'email') = 'mgt.baroncorporation@gmail.com');

drop policy if exists "Management can insert jobs" on public.jobs;
create policy "Management can insert jobs" on public.jobs
for insert to authenticated
with check ((auth.jwt() ->> 'email') = 'mgt.baroncorporation@gmail.com');

drop policy if exists "Management can update jobs" on public.jobs;
create policy "Management can update jobs" on public.jobs
for update to authenticated
using ((auth.jwt() ->> 'email') = 'mgt.baroncorporation@gmail.com')
with check ((auth.jwt() ->> 'email') = 'mgt.baroncorporation@gmail.com');

drop policy if exists "Management can delete jobs" on public.jobs;
create policy "Management can delete jobs" on public.jobs
for delete to authenticated
using ((auth.jwt() ->> 'email') = 'mgt.baroncorporation@gmail.com');

drop policy if exists "Public can submit applications" on public.applications;
create policy "Public can submit applications" on public.applications
for insert to anon, authenticated
with check (consent = true and review_status = 'waiting_review');

drop policy if exists "Management can read applications" on public.applications;
create policy "Management can read applications" on public.applications
for select to authenticated
using ((auth.jwt() ->> 'email') = 'mgt.baroncorporation@gmail.com');

drop policy if exists "Management can update applications" on public.applications;
create policy "Management can update applications" on public.applications
for update to authenticated
using ((auth.jwt() ->> 'email') = 'mgt.baroncorporation@gmail.com')
with check ((auth.jwt() ->> 'email') = 'mgt.baroncorporation@gmail.com');

-- Explicit API privileges. RLS policies above still control which rows/actions are allowed.
grant select on public.jobs to anon, authenticated;
grant insert on public.applications to anon, authenticated;
grant select, insert, update, delete on public.jobs to authenticated;
grant select, update on public.applications to authenticated;
