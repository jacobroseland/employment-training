alter table public.job_applications
add column user_id uuid references auth.users (id) on delete cascade;

alter table public.job_applications
alter column user_id set not null;

create index job_applications_user_id_idx
on public.job_applications (user_id);

grant select, insert, update, delete
on table public.job_applications
to authenticated;

create policy "Users can read their own job applications"
on public.job_applications
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can add their own job applications"
on public.job_applications
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own job applications"
on public.job_applications
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own job applications"
on public.job_applications
for delete
to authenticated
using ((select auth.uid()) = user_id);
