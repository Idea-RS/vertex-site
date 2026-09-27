# FLIP Waitlist Infrastructure

This document outlines the Supabase backend configuration for the FLIP launch waitlist.

## 1. Project Overview
- **Project Name:** `vertex-flip`
- **Project ID:** `syswhwhdoqhyzqgkczma`
- **Region:** `ap-south-1` (Mumbai)
- **Project URL:** `https://syswhwhdoqhyzqgkczma.supabase.co`
- **Edge Function Endpoint:** `https://syswhwhdoqhyzqgkczma.supabase.co/functions/v1/join-waitlist`

---

## 2. Database Schema

The waitlist uses the table `public.waitlist` defined in [`supabase/migrations/001_waitlist.sql`](file:///Users/raahildesai/Raahil%20CP/Projects/vertex/supabase/migrations/001_waitlist.sql).

- `id`: `uuid` (Primary Key, auto-generated)
- `email`: `extensions.citext` (Unique, case-insensitive, required)
- `role`: `text` (Check constraint: `manufacturer`, `designer_engineer`, `student_maker`)
- `consent`: `boolean` (Required, must be `true`)
- `consent_at`: `timestamptz` (Timestamp of consent)
- `source`: `text` (Form context or campaign tag)
- `referrer`: `text` (Document referrer if available)
- `utm`: `jsonb` (UTM campaign parameters captured silently)
- `ip_hash`: `text` (Salted SHA-256 hash of client IP for rate limiting; raw IPs are never stored)
- `created_at`: `timestamptz` (Indexed timestamp)

### Row Level Security (RLS)
RLS is enabled with **no public policies**. Anon and authenticated client roles have zero read, update, or delete access. Only the Edge Function (using the internal service role) can insert into the table.

---

## 3. Environment Variables & Secrets

### Website Environment Variables (`.env.local`)
Configure these in the website repository or hosting environment (Vercel / Cloudflare Pages / local):

```env
NEXT_PUBLIC_SUPABASE_URL=https://syswhwhdoqhyzqgkczma.supabase.co
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<your-cloudflare-turnstile-site-key>
```

> **Security Rule:** Never include `SUPABASE_SERVICE_ROLE_KEY` in website environment variables or client code.

### Edge Function Secrets (Supabase Dashboard)
Configure these in the Supabase Dashboard under:
**Project Settings → Edge Functions → Secrets** (or via `supabase secrets set`):

| Secret Name | Description | Required | Example |
| :--- | :--- | :--- | :--- |
| `TURNSTILE_SECRET` | Cloudflare Turnstile secret key for server-side token verification | Yes | `0x4AAAAAA...` |
| `IP_HASH_SALT` | Random salt used for SHA-256 IP hashing | Yes | `any-random-long-secret-string` |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed production domains | Optional | `https://tryvertex.tech,https://www.tryvertex.tech` |
| `RESEND_API_KEY` | Resend API key for sending confirmation emails from `founder@tryvertex.tech` | Optional | `re_...` |

*(Note: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically injected into Edge Functions by the Supabase runtime).*

---

## 4. Managing Waitlist Data

Run these queries in the **Supabase Dashboard → SQL Editor**:

### Exporting the Waitlist
```sql
select
  email,
  role,
  consent_at,
  source,
  referrer,
  utm,
  created_at
from public.waitlist
order by created_at desc;
```
*(You can click **Export to CSV** in the Supabase SQL editor).*

### Deleting a Person on Request (Privacy / GDPR)
```sql
delete from public.waitlist
where email = 'user@example.com';
```
*(Because email uses `citext`, casing is handled automatically).*

### Checking Signup Counts by Role
```sql
select
  coalesce(role, 'unspecified') as user_role,
  count(*) as total_signups
from public.waitlist
group by role
order by total_signups desc;
```
