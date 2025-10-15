-- Enables UUIDs if needed later
-- create extension if not exists "uuid-ossp";

-- Queue status enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'queue_status') then
    create type queue_status as enum ('waiting','notified','serving','done','skipped','abandoned');
  end if;
end$$;

-- Businesses table
create table if not exists businesses (
  id serial primary key,
  name text not null,
  type text not null default 'Service',
  address text not null,
  latitude double precision not null,
  longitude double precision not null,
  avg_service_time int not null default 7, -- minutes per person
  is_open boolean not null default true,
  created_at timestamptz not null default now()
);

-- Queue entries table
create table if not exists queue_entries (
  id serial primary key,
  business_id int not null references businesses(id) on delete cascade,
  customer_name text not null,
  phone text,
  status queue_status not null default 'waiting',
  created_at timestamptz not null default now(),
  notified_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz
);

-- Helpful index for position calculations
create index if not exists idx_queue_entries_business_created
  on queue_entries (business_id, created_at);
