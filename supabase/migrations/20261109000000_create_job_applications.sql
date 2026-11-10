create table public.job_applications (
  id uuid primary key default gen_random_uuid(),
  company_name text not null check (char_length(btrim(company_name)) > 0),
  role_title text not null check (char_length(btrim(role_title)) > 0),
  status text not null default 'saved' check (status in ('saved', 'applied', 'interviewing', 'offer', 'closed')),
  work_arrangement text not null default 'remote' check (work_arrangement in ('remote', 'hybrid', 'on-site')),
  location text,
  salary_range text,
  job_url text,
  date_applied date,
  next_follow_up_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index job_applications_next_follow_up_date_idx
  on public.job_applications (next_follow_up_date)
  where next_follow_up_date is not null;

alter table public.job_applications enable row level security;
