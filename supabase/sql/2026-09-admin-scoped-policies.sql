-- ============================================================================
-- Mahalaxmi Enterprises — Admin-scoped RLS policies
-- ============================================================================
-- Run this in the Supabase Dashboard -> SQL Editor. The verification queries
-- tell you what is already in place; only run the CREATE/DROP statements whose
-- change is actually needed.
--
-- Context: the `admins` table (id uuid -> auth.users, name, email, created_at)
-- now gates admin access. Products write policies were already updated to
-- require an `admins` row; this file handles the `product-images` storage
-- bucket and any gaps that would silently break the flow below.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- STEP 1 — VERIFY what exists today (read-only, always safe to run)
-- ---------------------------------------------------------------------------

-- 1a. Current policies on the product-images bucket objects:
-- select policy_name, cmd, roles, qual, with_check
-- from pg_policies
-- where schemaname = 'storage'
--   and tablename = 'objects'
--   and policy_definition ilike '%product-images%'
--   or (schemaname = 'storage' and tablename = 'objects' and policy_name ilike '%product%');

-- 1b. Current policies on the products table:
-- select policy_name, cmd, roles, qual, with_check
-- from pg_policies
-- where schemaname = 'public' and tablename = 'products';

-- 1c. Current policies on the admins table (see STEP 3 — this one is critical):
-- select policy_name, cmd, roles, qual
-- from pg_policies
-- where schemaname = 'public' and tablename = 'admins';

-- ---------------------------------------------------------------------------
-- STEP 2 — product-images bucket: admins-scoped write policies
-- ---------------------------------------------------------------------------
-- Run ONLY if STEP 1a shows the old "to authenticated"-only policies. If your
-- existing policies already contain "exists (select 1 from public.admins ...)",
-- skip this section entirely.

drop policy if exists "Authenticated admin upload product images" on storage.objects;
drop policy if exists "Authenticated admin update product images" on storage.objects;
drop policy if exists "Authenticated admin delete product images" on storage.objects;

create policy "Admins can upload product images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'product-images'
  and exists (select 1 from public.admins where id = auth.uid())
);

create policy "Admins can update product images"
on storage.objects for update to authenticated
using (
  bucket_id = 'product-images'
  and exists (select 1 from public.admins where id = auth.uid())
);

create policy "Admins can delete product images"
on storage.objects for delete to authenticated
using (
  bucket_id = 'product-images'
  and exists (select 1 from public.admins where id = auth.uid())
);

-- ---------------------------------------------------------------------------
-- STEP 3 — admins table: let authenticated users read their OWN row
-- ---------------------------------------------------------------------------
-- CRITICAL: both the app's isCurrentUserAdmin() check and the EXISTS()
-- subqueries above execute as the *invoking* user, so RLS on `public.admins`
-- must allow an authenticated user to select their own row. If the admins
-- table has RLS enabled with no such policy, every admin login/upload will
-- fail even with correct data. Run ONLY if STEP 1c shows no such policy.

-- alter table public.admins enable row level security;  -- (should already be on)

drop policy if exists "Admins can read own row" on public.admins;

create policy "Admins can read own row"
on public.admins for select to authenticated
using (id = auth.uid());

-- ---------------------------------------------------------------------------
-- STEP 4 — after creating the admin user (Dashboard -> Authentication ->
-- Users -> "Add user"), insert the matching admins row using the SAME UUID.
-- The app's admin check fails without it — a valid auth login is NOT enough.
-- ---------------------------------------------------------------------------

-- insert into public.admins (id, name, email)
-- values ('<auth-user-uuid>', 'Admin Name', 'admin@example.com');
