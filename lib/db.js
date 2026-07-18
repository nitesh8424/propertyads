import { Pool } from 'pg';

// if (!process.env.DATABASE_URL) {
//   console.warn(
//     'WARNING: DATABASE_URL is not set. Copy .env.example to .env.local and point it at your Postgres instance.'
//   );
// }

const pool = new Pool({
  user: process.env.DATABASE_USER,
  password : process.env.DATABASE_PASSWORD, 
  database: process.env.DATABASE_DB,
  host : process.env.DATABASE_HOST,
  port : 5432
});

let schemaReady;

function ensureSchema() {
  if (!schemaReady) {
    schemaReady = pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS ads (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price NUMERIC NOT NULL,
        property_type TEXT NOT NULL,
        city TEXT NOT NULL,
        locality TEXT,
        bedrooms INTEGER,
        bathrooms INTEGER,
        area_sqft NUMERIC,
        contact_name TEXT,
        contact_phone TEXT,
        contact_email TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS ad_images (
        id SERIAL PRIMARY KEY,
        ad_id INTEGER NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
        filename TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0
      );

      CREATE INDEX IF NOT EXISTS idx_ads_city ON ads(city);
      CREATE INDEX IF NOT EXISTS idx_ads_status ON ads(status);
      CREATE INDEX IF NOT EXISTS idx_ad_images_ad_id ON ad_images(ad_id);
    `);
  }
  return schemaReady;
}

// Runs a query, making sure the schema exists first. Every DB access in the
// app goes through this so a fresh database self-initializes on first use.
export async function query(text, params) {
  await ensureSchema();
  return pool.query(text, params);
}

export default pool;
