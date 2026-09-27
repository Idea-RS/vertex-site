create extension if not exists citext with schema extensions;

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email extensions.citext unique not null,
  role text check (role in ('manufacturer', 'designer_engineer', 'student_maker')),
  consent boolean not null,
  consent_at timestamptz,
  source text,
  referrer text,
  utm jsonb,
  ip_hash text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.waitlist enable row level security;

-- No SELECT, UPDATE, or DELETE policies for anon or authenticated roles.
-- The public cannot read, update, or delete records.
-- Only the Edge Function using the service role key can insert and manage rows.

-- Index on created_at
create index if not exists idx_waitlist_created_at on public.waitlist (created_at desc);
