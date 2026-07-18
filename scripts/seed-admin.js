// Creates (or updates the password of) the single admin account,
// using ADMIN_USERNAME and ADMIN_PASSWORD from .env.local.
// Run with: npm run seed-admin

const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

// Minimal .env.local loader (avoids adding a dotenv dependency).
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const { ADMIN_USERNAME, ADMIN_PASSWORD, DATABASE_URL } = process.env;

// if (!DATABASE_URL) {
//   console.error('DATABASE_URL must be set in .env.local (e.g. from docker-compose or your Postgres instance).');
//   process.exit(1);
// }
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.error('ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env');
  process.exit(1);
}

async function main() {
  const pool = new Pool({
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB,
    host: process.env.DATABASE_HOST,
    port: 5432
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 10);

  const { rows } = await pool.query('SELECT id FROM admins WHERE username = $1', [ADMIN_USERNAME]);

  if (rows.length > 0) {
    await pool.query('UPDATE admins SET password_hash = $1 WHERE username = $2', [
      passwordHash,
      ADMIN_USERNAME
    ]);
    console.log(`Updated password for admin "${ADMIN_USERNAME}".`);
  } else {
    await pool.query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', [
      ADMIN_USERNAME,
      passwordHash
    ]);
    console.log(`Created admin "${ADMIN_USERNAME}".`);
  }

  await pool.end();
}

main().catch((err) => {
  console.error('Failed to seed admin:', err.message);
  process.exit(1);
});
