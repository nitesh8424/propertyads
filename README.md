# LandHub – Next.js Property Website

Complete responsive property website with PostgreSQL as the only source of property data. No `./data` property file is used by the application.

## Stack
- Next.js 16 App Router
- React 19 + TypeScript
- PostgreSQL via `pg`
- Property photos stored as BYTEA in PostgreSQL (no cloud credential required)
- Responsive desktop/mobile UI

## Setup
1. Install Node.js 20.19+.
2. Copy `.env.example` to `.env` and set `DATABASE_URL`.
3. `npm install`
4. `npm run db:init`
5. Optional demo data: `npm run db:seed`
6. `npm run dev`

Open http://localhost:3000

Admin create page: http://localhost:3000/admin/properties/new

## Important
- Homepage, search and property details read directly from PostgreSQL.
- Admin form includes Price, location, map coordinates, main image and multiple other images.
- Images are inserted into PostgreSQL. This makes the project self-contained; for very large production image libraries, move photo storage to S3/Cloudinary later.
- Admin authentication is intentionally not implemented yet; the page is separated so authentication can be added before production deployment.
