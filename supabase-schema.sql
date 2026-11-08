-- Run in Supabase SQL Editor.
-- Keep order data private. Do not enable public read access to customer records.
create table if not exists public.orders (
  id uuid primary key,
  created_at timestamptz not null default now(),
  customer_name text not null,
  phone text not null,
  email text,
  address text not null,
  city text not null,
  country text not null,
  market text not null check (market in ('KR','UZ')),
  currency text not null check (currency in ('KRW','UZS')),
  delivery text not null,
  items jsonb not null,
  status text not null default 'pending_payment'
    check (status in ('pending_payment','paid','processing','shipped','cancelled','refunded'))
);

alter table public.orders enable row level security;

-- Intentionally no public policies. The server API uses SUPABASE_SERVICE_ROLE_KEY.
-- NEVER put that service-role key in NEXT_PUBLIC_* variables or browser code.
