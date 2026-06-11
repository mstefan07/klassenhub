# Supabase Schema und RLS

Dieses Schema ist für PostgreSQL/Supabase gedacht. Es nutzt nur den öffentlichen Anon-Key im Frontend. Service-Role-Keys gehören nie in den Client.

## Enums

```sql
create type user_role as enum ('student', 'class_representative', 'teacher', 'admin');
create type priority as enum ('low', 'medium', 'high');
create type event_type as enum ('exam', 'deadline', 'lesson', 'project', 'other');
create type event_status as enum ('planned', 'soon', 'done', 'missed');
create type assignment_status as enum ('open', 'in_progress', 'done', 'overdue');
create type resource_type as enum ('file', 'link', 'note');
create type announcement_importance as enum ('normal', 'important', 'urgent');
create type poll_type as enum ('yes_no', 'single_choice', 'multiple_choice', 'rating', 'date_finding');
create type poll_result_visibility as enum ('immediate', 'after_end', 'admins_only');
create type poll_status as enum ('planned', 'active', 'ended');
create type notification_type as enum ('next_exam', 'assignment_due', 'new_announcement', 'active_poll', 'project_deadline');
```

## Tabellen

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  school text not null,
  school_year text not null,
  invitation_code text not null unique,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table class_members (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role user_role not null default 'student',
  joined_at timestamptz not null default now(),
  unique (class_id, user_id)
);

create table invitations (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  code text not null unique,
  active boolean not null default true,
  expires_at timestamptz,
  max_uses int,
  used_count int not null default 0,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

create table subjects (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  name text not null,
  color text not null,
  teacher_name text,
  created_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  title text not null,
  type event_type not null,
  date date not null,
  time time,
  subject text not null,
  room text,
  description text,
  priority priority not null default 'medium',
  status event_status not null default 'planned',
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  title text not null,
  subject text not null,
  description text not null,
  due_date date not null,
  priority priority not null default 'medium',
  status assignment_status not null default 'open',
  assigned_to uuid references profiles(id),
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table resources (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  title text not null,
  subject text,
  type resource_type not null,
  url text,
  description text,
  tags text[] not null default '{}',
  uploaded_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

create table announcements (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  title text not null,
  content text not null,
  importance announcement_importance not null default 'normal',
  pinned boolean not null default false,
  valid_until timestamptz,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

create table polls (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  title text not null,
  description text,
  type poll_type not null,
  options text[] not null default '{}',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  anonymous boolean not null default false,
  multiple_choice boolean not null default false,
  result_visibility poll_result_visibility not null default 'immediate',
  status poll_status not null default 'planned',
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references polls(id) on delete cascade,
  label text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table poll_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references polls(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  selected_option_ids uuid[] not null default '{}',
  rating_value int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (poll_id, user_id)
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
```

## Helper für RLS

```sql
create or replace function is_class_member(target_class_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from class_members
    where class_id = target_class_id and user_id = auth.uid()
  );
$$;

create or replace function has_class_role(target_class_id uuid, allowed_roles user_role[])
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from class_members
    where class_id = target_class_id
      and user_id = auth.uid()
      and role = any(allowed_roles)
  );
$$;
```

## RLS Grundregeln

Für alle Tabellen aktivieren:

```sql
alter table profiles enable row level security;
alter table classes enable row level security;
alter table class_members enable row level security;
alter table invitations enable row level security;
alter table subjects enable row level security;
alter table events enable row level security;
alter table assignments enable row level security;
alter table resources enable row level security;
alter table announcements enable row level security;
alter table polls enable row level security;
alter table poll_options enable row level security;
alter table poll_votes enable row level security;
alter table notifications enable row level security;
```

Beispiel-Policies:

```sql
create policy "profiles_select_own" on profiles
for select using (id = auth.uid());

create policy "profiles_update_own" on profiles
for update using (id = auth.uid());

create policy "classes_select_member" on classes
for select using (is_class_member(id));

create policy "classes_insert_authenticated" on classes
for insert with check (created_by = auth.uid());

create policy "classes_update_admin" on classes
for update using (has_class_role(id, array['admin']::user_role[]));

create policy "class_members_select_member" on class_members
for select using (is_class_member(class_id));

create policy "class_members_insert_self_or_admin" on class_members
for insert with check (
  user_id = auth.uid()
  or has_class_role(class_id, array['admin']::user_role[])
);

create policy "class_members_update_admin" on class_members
for update using (has_class_role(class_id, array['admin']::user_role[]));

create policy "events_select_member" on events
for select using (is_class_member(class_id));

create policy "events_insert_teacher_admin" on events
for insert with check (
  has_class_role(class_id, array['teacher','admin']::user_role[])
);

create policy "assignments_select_member" on assignments
for select using (is_class_member(class_id));

create policy "assignments_insert_teacher_admin" on assignments
for insert with check (
  has_class_role(class_id, array['teacher','admin']::user_role[])
);

create policy "resources_select_member" on resources
for select using (is_class_member(class_id));

create policy "resources_insert_member" on resources
for insert with check (is_class_member(class_id));

create policy "announcements_select_member" on announcements
for select using (is_class_member(class_id));

create policy "announcements_insert_allowed_roles" on announcements
for insert with check (
  has_class_role(class_id, array['class_representative','teacher','admin']::user_role[])
);

create policy "polls_select_member" on polls
for select using (is_class_member(class_id));

create policy "polls_insert_representative_admin" on polls
for insert with check (
  has_class_role(class_id, array['class_representative','admin']::user_role[])
);

create policy "poll_votes_select_member" on poll_votes
for select using (
  exists (
    select 1 from polls
    where polls.id = poll_votes.poll_id
      and is_class_member(polls.class_id)
  )
);

create policy "poll_votes_upsert_member" on poll_votes
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from polls
    where polls.id = poll_votes.poll_id
      and is_class_member(polls.class_id)
      and now() between polls.starts_at and polls.ends_at
  )
);

create policy "notifications_select_own" on notifications
for select using (user_id = auth.uid());
```

Wichtig: Für produktive Nutzung müssen Update/Delete-Policies pro Tabelle ergänzt und getestet werden.
