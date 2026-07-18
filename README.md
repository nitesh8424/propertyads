# PropertyAds

A property-for-sale listings site. Anyone can browse and search listings;
only the admin (a single account) can log in to post, edit, or delete them.

Built with **Next.js 14** (App Router) so one project serves both the
frontend pages and the backend API routes — no separate server needed.

## Stack

- **Framework:** Next.js 14 (App Router, JavaScript)
- **Database:** PostgreSQL via the `pg` driver (schema auto-creates on first run)
- **Auth:** Single admin account, password hashed with `bcryptjs`, session as an
  HTTP-only JWT cookie signed with `jose`
- **Styling:** Tailwind CSS
- **Image uploads:** Saved to `public/uploads/`, admin-only

## Features

- Public: browse listings, search/filter by city, property type, and price range,
  view a listing's full details, photos, and contact info
- Admin: login, dashboard of all listings (including sold/inactive), create/edit/delete
  listings, upload/remove photos per listing
- Route protection: `/admin/*` pages redirect to login if not authenticated;
  the API also rejects create/edit/delete/upload requests without a valid admin session
  (so the API is safe even if someone bypasses the UI)

## Getting started

### 1. Get a Postgres database running

Easiest option — use the included Docker Compose file:

```bash
docker compose up -d
```

This starts Postgres on `localhost:5432` with user/password/db all set to
`propertyads` (matching the default `DATABASE_URL` below). If you'd rather
use a Postgres you already have (local install, Supabase, Neon, RDS, etc.),
skip this step and just point `DATABASE_URL` at it.

### 2. Install and configure

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```
DATABASE_URL=postgres://propertyads:propertyads@localhost:5432/propertyads
JWT_SECRET=<a long random string>
ADMIN_USERNAME=<pick a username>
ADMIN_PASSWORD=<pick a password>
```

### 3. Create the admin account

```bash
npm run seed-admin
```

This connects to `DATABASE_URL`, creates the `admins` table if needed, and
stores your admin's bcrypt-hashed password. The rest of the schema (`ads`,
`ad_images`) auto-creates the first time the app queries the database — no
separate migration step needed.

### 4. Run it

```bash
npm run dev
```

- Visit `http://localhost:3000` to browse listings.
- Visit `http://localhost:3000/admin` to log in and manage listings.

To change the admin password later, update `ADMIN_PASSWORD` in `.env.local`
and re-run `npm run seed-admin`.

### Adding ads directly via the database

Since it's now a real Postgres database, you can connect with `psql`, a GUI
(pgAdmin, TablePlus, DBeaver, etc.), or any Postgres-compatible tool and
insert/edit rows in the `ads` and `ad_images` tables directly, in addition to
using the admin UI. See the schema in `lib/db.js` for the exact columns.

## Production notes

- Run `npm run build && npm start` for production.
- `public/uploads/` (where photos are saved) must live on **persistent disk**
  — this won't work as-is on a serverless/ephemeral host like Vercel, since
  the filesystem resets between requests there. It runs fine on a regular
  VPS, a Docker container with a mounted volume, or any host with a
  persistent filesystem (e.g. Render, Railway, a plain Node server). The
  Postgres database itself has no such restriction — it can be hosted
  anywhere (Neon, Supabase, RDS, etc.) regardless of where the app runs.
- For serverless hosting, swap the local uploads folder for object storage
  (e.g. S3, Cloudinary) — `app/api/upload/route.js` is the only place that
  would need to change.
- Set `JWT_SECRET` to a strong random value in production and always serve
  over HTTPS (the session cookie is marked `secure` automatically when
  `NODE_ENV=production`).

## Project structure

```
app/
  page.js                  Public homepage (search + listing grid)
  ads/[id]/page.js          Public listing detail page
  admin/
    login/page.js           Admin login
    page.js                 Admin dashboard (list/edit/delete)
    new/page.js              Create listing
    edit/[id]/page.js        Edit listing
  api/
    auth/login, auth/logout  Session endpoints
    ads, ads/[id]             Listing CRUD (public GET, admin-only writes)
    upload                    Admin-only image upload
    images/[id]                Admin-only single image delete
components/
  AdForm.js                 Shared create/edit form (fields + photo upload)
lib/
  db.js                     Postgres connection pool + schema
  ads.js                    Ad/image data access (async, pg queries)
  auth.js                   JWT sign/verify, session cookie config
middleware.js                Redirects unauthenticated users away from /admin/*
scripts/seed-admin.js         Creates/updates the admin account
docker-compose.yml            Optional local Postgres for development
```

