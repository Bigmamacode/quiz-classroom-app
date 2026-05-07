create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.quiz (
  id uuid primary key default gen_random_uuid(),
  materia text not null,
  argomento text not null,
  domanda text not null,
  "A" text not null,
  "B" text not null,
  "C" text not null,
  "D" text not null,
  "E" text not null,
  corretta text not null check (corretta in ('A', 'B', 'C', 'D', 'E')),
  spiegazione text not null,
  difficolta int not null default 1 check (difficolta between 1 and 5),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  materia text not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  total_questions int not null default 0,
  correct_answers int not null default 0,
  percentage numeric(5,2) not null default 0
);

create table if not exists public.tentativi (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.quiz_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id uuid not null references public.quiz(id) on delete cascade,
  risposta_data text not null check (risposta_data in ('A', 'B', 'C', 'D', 'E')),
  corretta boolean not null,
  timestamp timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    new.raw_user_meta_data ->> 'full_name',
    coalesce((new.raw_user_meta_data ->> 'role')::text, 'student')
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.quiz enable row level security;
alter table public.quiz_sessions enable row level security;
alter table public.tentativi enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles for update
to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

drop policy if exists "quiz_read_authenticated" on public.quiz;
create policy "quiz_read_authenticated"
on public.quiz for select
to authenticated
using (true);

drop policy if exists "quiz_admin_insert" on public.quiz;
create policy "quiz_admin_insert"
on public.quiz for insert
to authenticated
with check (public.is_admin());

drop policy if exists "quiz_admin_update" on public.quiz;
create policy "quiz_admin_update"
on public.quiz for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "quiz_admin_delete" on public.quiz;
create policy "quiz_admin_delete"
on public.quiz for delete
to authenticated
using (public.is_admin());

drop policy if exists "sessions_read_own_or_admin" on public.quiz_sessions;
create policy "sessions_read_own_or_admin"
on public.quiz_sessions for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "sessions_insert_own" on public.quiz_sessions;
create policy "sessions_insert_own"
on public.quiz_sessions for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "sessions_update_own_or_admin" on public.quiz_sessions;
create policy "sessions_update_own_or_admin"
on public.quiz_sessions for update
to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "tentativi_read_own_or_admin" on public.tentativi;
create policy "tentativi_read_own_or_admin"
on public.tentativi for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "tentativi_insert_own" on public.tentativi;
create policy "tentativi_insert_own"
on public.tentativi for insert
to authenticated
with check (user_id = auth.uid());

create index if not exists idx_quiz_materia on public.quiz (materia);
create index if not exists idx_quiz_argomento on public.quiz (argomento);
create index if not exists idx_sessions_user_id on public.quiz_sessions (user_id);
create index if not exists idx_tentativi_user_id on public.tentativi (user_id);
create index if not exists idx_tentativi_quiz_id on public.tentativi (quiz_id);
