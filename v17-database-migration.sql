-- Baron Jobs V17 one-time migration.
-- Allows applications to be submitted for career-interest job titles
-- even when there is no pre-created vacancy row in public.jobs.

alter table public.applications
  alter column job_id drop not null;

create index if not exists applications_job_title_idx
  on public.applications(job_title_snapshot);
