create table public.user_app_installations (
  user_id uuid not null references auth.users (id) on delete cascade,
  app_id text not null check (char_length(btrim(app_id)) > 0),
  installed_at timestamptz not null default now(),
  primary key (user_id, app_id)
);

alter table public.user_app_installations enable row level security;

grant select, insert, delete
on table public.user_app_installations
to authenticated;

create policy "Users can read their own app installations"
on public.user_app_installations
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can install their own apps"
on public.user_app_installations
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can remove their own app installations"
on public.user_app_installations
for delete
to authenticated
using ((select auth.uid()) = user_id);
