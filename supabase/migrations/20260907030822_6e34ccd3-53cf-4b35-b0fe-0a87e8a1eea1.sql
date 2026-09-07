create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  )
$$;

create policy "Authenticated can read roles"
on public.user_roles for select to authenticated using (true);

create policy "Admins manage roles"
on public.user_roles for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- admins can manage invite codes
create policy "Admins can read invite codes"
on public.invite_codes for select to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can create invite codes"
on public.invite_codes for insert to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete invite codes"
on public.invite_codes for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- first registered user becomes admin
insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role from auth.users order by created_at asc limit 1
on conflict do nothing;