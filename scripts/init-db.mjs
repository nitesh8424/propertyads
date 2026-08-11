import fs from "node:fs";
import pg from "pg";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
await pool.query(
  fs.readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"),
);
await pool.end();
console.log("Database initialized.");
