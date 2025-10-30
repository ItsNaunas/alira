-- Create dashboard_tasks table
create table if not exists public.dashboard_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid null references public.dashboards(id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.dashboard_tasks enable row level security;

-- Indexes
create index if not exists dashboard_tasks_user_id_idx on public.dashboard_tasks(user_id);
create index if not exists dashboard_tasks_plan_id_idx on public.dashboard_tasks(plan_id);
create index if not exists dashboard_tasks_user_sort_idx on public.dashboard_tasks(user_id, sort_order);

-- Policies
drop policy if exists "tasks_select_own" on public.dashboard_tasks;
create policy "tasks_select_own" on public.dashboard_tasks
  for select using ( auth.uid() = user_id );

drop policy if exists "tasks_insert_own" on public.dashboard_tasks;
create policy "tasks_insert_own" on public.dashboard_tasks
  for insert with check ( auth.uid() = user_id );

drop policy if exists "tasks_update_own" on public.dashboard_tasks;
create policy "tasks_update_own" on public.dashboard_tasks
  for update using ( auth.uid() = user_id );

drop policy if exists "tasks_delete_own" on public.dashboard_tasks;
create policy "tasks_delete_own" on public.dashboard_tasks
  for delete using ( auth.uid() = user_id );


