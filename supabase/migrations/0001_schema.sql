-- uEvent schema: tables, enums, triggers, the public events view, and
-- read-only row level security. All writes go through server code that uses
-- the service role, so no insert, update or delete policies exist.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.club_role as enum ('president', 'committee');
create type public.invitation_role as enum ('src_admin', 'president', 'committee');
create type public.event_status as enum (
  'draft', 'submitted', 'returned', 'rejected',
  'awaiting_sa_letter', 'verifying_sa_letter', 'approved', 'cancelled'
);
create type public.attachment_kind as enum (
  'proposal_paper', 'advisor_form', 'sa_letter', 'report_photo', 'other'
);
create type public.change_kind as enum ('change', 'cancel');
create type public.request_status as enum ('pending', 'approved', 'rejected');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique check (email = lower(email)),
  full_name text not null default '',
  is_src_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (length(trim(name)) > 0),
  description text not null default '',
  created_at timestamptz not null default now()
);

create table public.club_members (
  club_id uuid not null references public.clubs (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.club_role not null default 'committee',
  can_submit boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (club_id, user_id)
);

-- A club has at most one president.
create unique index club_members_one_president
  on public.club_members (club_id) where role = 'president';
create index club_members_user_id on public.club_members (user_id);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email = lower(email)),
  club_id uuid references public.clubs (id) on delete cascade,
  role public.invitation_role not null,
  invited_by uuid references public.profiles (id) on delete set null,
  claimed_at timestamptz,
  created_at timestamptz not null default now(),
  -- SRC admin invitations have no club; club invitations must have one.
  check ((role = 'src_admin') = (club_id is null)),
  unique nulls not distinct (email, club_id, role)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs (id) on delete cascade,
  title text not null,
  description text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  venue text not null,
  expected_participants int not null check (expected_participants >= 0),
  budget jsonb not null default '[]'::jsonb check (jsonb_typeof(budget) = 'array'),
  poster_path text,
  signup_url text,
  status public.event_status not null default 'draft',
  late_notice boolean not null default false,
  submitted_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index events_club_id on public.events (club_id);
create index events_status_starts_at on public.events (status, starts_at);

create table public.event_attachments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  kind public.attachment_kind not null,
  path text not null unique,
  file_name text not null,
  size_bytes bigint not null check (size_bytes > 0),
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index event_attachments_event_id on public.event_attachments (event_id);

create table public.event_history (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  from_status public.event_status,
  to_status public.event_status,
  comment text,
  created_at timestamptz not null default now()
);

create index event_history_event_id on public.event_history (event_id, created_at);

create table public.change_requests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  kind public.change_kind not null,
  proposed jsonb not null default '{}'::jsonb check (jsonb_typeof(proposed) = 'object'),
  reason text not null,
  status public.request_status not null default 'pending',
  requested_by uuid references public.profiles (id) on delete set null,
  decided_by uuid references public.profiles (id) on delete set null,
  decision_comment text,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create index change_requests_event_id on public.change_requests (event_id);

create table public.event_reports (
  event_id uuid primary key references public.events (id) on delete cascade,
  summary text not null,
  actual_attendance int not null check (actual_attendance >= 0),
  actual_spending numeric(12, 2) not null check (actual_spending >= 0),
  submitted_by uuid references public.profiles (id) on delete set null,
  submitted_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null default '',
  link text not null default '/',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_id on public.notifications (user_id, created_at desc);

create table public.settings (
  key text primary key,
  value int not null
);

-- Defaults from the spec. Kept in the migration, not only the seed, so that
-- production has them too.
insert into public.settings (key, value) values
  ('min_notice_days', 3),
  ('report_due_days', 14)
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

create function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- Only university addresses may have accounts: exactly one "@" and the
-- domain utp.edu.my, compared case-insensitively. Subdomains are refused.
create function public.enforce_university_email() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.email is null or lower(new.email) !~ '^[^@[:space:]]+@utp\.edu\.my$' then
    raise exception 'Only @utp.edu.my email addresses can have an account'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger auth_users_university_email
  before insert or update of email on auth.users
  for each row execute function public.enforce_university_email();

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

create trigger auth_users_create_profile
  after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.handle_user_email_change() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  update public.profiles set email = lower(new.email) where id = new.id;
  return new;
end;
$$;

create trigger auth_users_sync_email
  after update of email on auth.users
  for each row when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();

-- ---------------------------------------------------------------------------
-- Public view: approved events only, without budget, paperwork or history
-- ---------------------------------------------------------------------------

-- Runs with the owner's rights on purpose, so anonymous visitors can read
-- these columns of approved events without any access to the tables.
create view public.public_events as
  select
    e.id, e.title, e.description, e.starts_at, e.ends_at, e.venue,
    e.poster_path, e.signup_url, e.club_id, c.name as club_name
  from public.events e
  join public.clubs c on c.id = e.club_id
  where e.status = 'approved';

-- ---------------------------------------------------------------------------
-- Policy helpers
-- ---------------------------------------------------------------------------

create function public.is_src_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(
    (select p.is_src_admin from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

create function public.is_club_member(club uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.club_members m
    where m.club_id = club and m.user_id = auth.uid()
  );
$$;

create function public.is_club_president(club uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.club_members m
    where m.club_id = club and m.user_id = auth.uid() and m.role = 'president'
  );
$$;

create function public.can_read_event(event uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.is_src_admin() or exists (
    select 1 from public.events e
    where e.id = event and public.is_club_member(e.club_id)
  );
$$;

-- ---------------------------------------------------------------------------
-- Privileges and row level security (read-only)
-- ---------------------------------------------------------------------------

revoke all on all tables in schema public from anon;
revoke insert, update, delete, truncate on all tables in schema public from authenticated;
alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke insert, update, delete, truncate on tables from authenticated;

grant select on public.public_events to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.clubs enable row level security;
alter table public.club_members enable row level security;
alter table public.invitations enable row level security;
alter table public.events enable row level security;
alter table public.event_attachments enable row level security;
alter table public.event_history enable row level security;
alter table public.change_requests enable row level security;
alter table public.event_reports enable row level security;
alter table public.notifications enable row level security;
alter table public.settings enable row level security;

create policy "signed-in users read profiles" on public.profiles
  for select to authenticated using (true);

create policy "signed-in users read clubs" on public.clubs
  for select to authenticated using (true);

create policy "admins and club members read memberships" on public.club_members
  for select to authenticated using (public.is_src_admin() or public.is_club_member(club_id));

create policy "admins and presidents read invitations" on public.invitations
  for select to authenticated
  using (public.is_src_admin() or (club_id is not null and public.is_club_president(club_id)));

create policy "admins and club members read events" on public.events
  for select to authenticated using (public.is_src_admin() or public.is_club_member(club_id));

create policy "admins and club members read attachments" on public.event_attachments
  for select to authenticated using (public.can_read_event(event_id));

create policy "admins and club members read history" on public.event_history
  for select to authenticated using (public.can_read_event(event_id));

create policy "admins and club members read change requests" on public.change_requests
  for select to authenticated using (public.can_read_event(event_id));

create policy "admins and club members read reports" on public.event_reports
  for select to authenticated using (public.can_read_event(event_id));

create policy "users read their own notifications" on public.notifications
  for select to authenticated using (user_id = auth.uid());

create policy "signed-in users read settings" on public.settings
  for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- Storage: private paperwork, public posters. No storage policies; uploads and
-- downloads go through signed URLs issued by server code.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('attachments', 'attachments', false, 10485760, array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
  ]),
  ('posters', 'posters', true, 10485760, array['image/jpeg', 'image/png'])
on conflict (id) do nothing;
