alter table public.forum_categories add column locked boolean not null default false;
update public.forum_categories set locked = true where slug = 'ogloszenia';

drop policy threads_insert_own on public.forum_threads;
create policy threads_insert_own on public.forum_threads for insert to authenticated
with check (
  auth.uid() = author_id and (
    not exists (select 1 from public.forum_categories c where c.id = category_id and c.locked)
    or public.has_role(auth.uid(), 'admin')
    or public.has_role(auth.uid(), 'owner')
  )
);

drop policy posts_insert_own on public.forum_posts;
create policy posts_insert_own on public.forum_posts for insert to authenticated
with check (
  auth.uid() = author_id and (
    not exists (
      select 1 from public.forum_threads t
      join public.forum_categories c on c.id = t.category_id
      where t.id = thread_id and c.locked
    )
    or public.has_role(auth.uid(), 'admin')
    or public.has_role(auth.uid(), 'owner')
  )
);