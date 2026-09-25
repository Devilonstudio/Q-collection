-- The Q Collection — database schema
-- Run this once in your Supabase project's SQL Editor (Database > SQL Editor > New query).
-- Safe to re-run: uses "if not exists" / "or replace" where possible.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  name text not null,
  price numeric, -- null = "Enquire for Price"
  description text not null default '',
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  storage_path text not null, -- path inside the storage bucket, needed to delete the file later
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Single-row table for site-wide settings (hero image, contact details).
create table if not exists site_settings (
  id int primary key default 1,
  hero_image_url text,
  hero_image_path text,
  phone_display text not null default '+92 300 000 0000',
  phone_href text not null default 'tel:+923000000000',
  whatsapp_number text not null default '923000000000',
  email text not null default 'hello@theqcollection.com',
  address_line1 text not null default 'Showroom by appointment',
  address_line2 text not null default 'Quetta, Balochistan, Pakistan',
  hours_line1 text not null default 'Mon – Sat: 11:00 AM – 8:00 PM',
  hours_line2 text not null default 'Sunday: By appointment',
  constraint single_row check (id = 1)
);

insert into site_settings (id) values (1) on conflict (id) do nothing;

-- List of user ids allowed to write (edit/delete) data. Add your admin's
-- auth user id here after creating them — see README.
create table if not exists admins (
  user_id uuid primary key
);

-- ---------------------------------------------------------------------------
-- Row Level Security — public can read, only listed admins can write
-- ---------------------------------------------------------------------------

alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table site_settings enable row level security;
alter table admins enable row level security;

drop policy if exists "public read categories" on categories;
create policy "public read categories" on categories for select using (true);

drop policy if exists "public read products" on products;
create policy "public read products" on products for select using (true);

drop policy if exists "public read product_images" on product_images;
create policy "public read product_images" on product_images for select using (true);

drop policy if exists "public read site_settings" on site_settings;
create policy "public read site_settings" on site_settings for select using (true);

drop policy if exists "admin write categories" on categories;
create policy "admin write categories" on categories for all
  using (auth.uid() in (select user_id from admins))
  with check (auth.uid() in (select user_id from admins));

drop policy if exists "admin write products" on products;
create policy "admin write products" on products for all
  using (auth.uid() in (select user_id from admins))
  with check (auth.uid() in (select user_id from admins));

drop policy if exists "admin write product_images" on product_images;
create policy "admin write product_images" on product_images for all
  using (auth.uid() in (select user_id from admins))
  with check (auth.uid() in (select user_id from admins));

drop policy if exists "admin write site_settings" on site_settings;
create policy "admin write site_settings" on site_settings for all
  using (auth.uid() in (select user_id from admins))
  with check (auth.uid() in (select user_id from admins));

-- Nobody can read the admins list except via the policies above referencing it;
-- no direct public access is needed or granted.

-- ---------------------------------------------------------------------------
-- Storage bucket for product + hero images
-- ---------------------------------------------------------------------------
-- Run this part too — creates a public-read bucket named "site-images".
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

drop policy if exists "public read site-images" on storage.objects;
create policy "public read site-images" on storage.objects
  for select using (bucket_id = 'site-images');

drop policy if exists "admin write site-images" on storage.objects;
create policy "admin write site-images" on storage.objects
  for all using (
    bucket_id = 'site-images'
    and auth.uid() in (select user_id from admins)
  )
  with check (
    bucket_id = 'site-images'
    and auth.uid() in (select user_id from admins)
  );

-- ---------------------------------------------------------------------------
-- Starter categories (matches the original 7 rooms, in order).
-- Safe to edit or delete afterwards from the admin dashboard.
-- ---------------------------------------------------------------------------
insert into categories (slug, name, tagline, description, sort_order)
values
  ('bedroom', 'Bedroom', 'Where the day ends and begins.', 'Bed frames, wardrobes and case pieces cut from dark timber, built for rooms meant for rest rather than show.', 1),
  ('living-room', 'Living Room', 'The room that holds the household.', 'Console units, shelving and occasional pieces for the room a home actually lives in.', 2),
  ('centre-tables', 'Centre Tables', 'A quiet anchor for the room''s centre.', 'Low tables in worked wood and brass trim, sized to hold a tray, a book, and not much else.', 3),
  ('sofa-sets', 'Sofa Sets', 'Built for long evenings and longer conversations.', 'Deep-seated frames upholstered by hand, in forms that hold their line after years of use.', 4),
  ('bedroom-chairs', 'Bedroom Chairs', 'A place to sit before you leave the room, or after you return.', 'Compact seating scaled for the bedroom — a chair for the corner, not the centre.', 5),
  ('office-furniture', 'Office Furniture', 'Furniture that keeps pace with the working day.', 'Desks, chairs and storage built for hours at a time, in the same materials as the rest of the house.', 6),
  ('dining-tables', 'Dining Tables', 'Where the table is set, and everyone gathers.', 'Solid-top dining tables sized from four seats to twelve, finished to darken gracefully with age.', 7)
on conflict (slug) do nothing;
