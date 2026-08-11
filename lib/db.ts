import { Pool, type QueryResultRow } from "pg";
let pool: Pool | undefined;
export function db() {
  if (!pool)
    pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });
  return pool;
}
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: unknown[] = [],
) {
  return db().query<T>(text, values);
}
