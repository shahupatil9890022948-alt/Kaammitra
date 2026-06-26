create type appointment_status as enum ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');
create type payment_status as enum ('NOT_REQUIRED', 'ORDER_CREATED', 'PAID', 'FAILED', 'REFUNDED');

create table if not exists appointments (
  id text primary key,
  service_id text not null,
  staff_id text not null,
  date text not null,
  time text not null,
  name text not null,
  mobile text not null,
  email text not null,
  notes text,
  status appointment_status not null default 'PENDING',
  payment_status payment_status not null default 'NOT_REQUIRED',
  payment_order_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists appointments_staff_slot_unique
  on appointments (staff_id, date, time)
  where status in ('PENDING', 'ACCEPTED');

create table if not exists services (
  id text primary key,
  name text not null,
  category text not null,
  description text not null,
  duration integer not null,
  price integer not null,
  image text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  value text not null,
  detail text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  text text not null,
  rating integer not null default 5,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table appointments enable row level security;
alter table services enable row level security;
alter table gallery_images enable row level security;
alter table offers enable row level security;
alter table testimonials enable row level security;

create policy "Public can read active services" on services for select using (active = true);
create policy "Public can read active offers" on offers for select using (active = true);
create policy "Public can read gallery" on gallery_images for select using (true);
create policy "Public can read approved testimonials" on testimonials for select using (approved = true);
create policy "Service role manages appointments" on appointments for all using (auth.role() = 'service_role');
