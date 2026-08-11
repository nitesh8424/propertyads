import { query } from "./db";
import type { Property, Photo } from "./types";
export async function getProperties(name = "", location = "") {
  const n = name.trim(),
    l = location.trim();
  return (
    await query<Property>(
      `SELECT p.*,ph.id primary_photo_id FROM properties p LEFT JOIN LATERAL(SELECT id FROM property_photos WHERE property_id=p.id ORDER BY is_primary DESC,sort_order,id LIMIT 1)ph ON TRUE WHERE($1='' OR p.title ILIKE '%'||$1||'%') AND($2='' OR p.location ILIKE '%'||$2||'%') ORDER BY p.created_at DESC`,
      [n, l],
    )
  ).rows;
}
export async function getProperty(id: number) {
  return (
    (
      await query<Property>(
        `SELECT p.*,ph.id primary_photo_id FROM properties p LEFT JOIN LATERAL(SELECT id FROM property_photos WHERE property_id=p.id ORDER BY is_primary DESC,sort_order,id LIMIT 1)ph ON TRUE WHERE p.id=$1`,
        [id],
      )
    ).rows[0] ?? null
  );
}
export async function getPhotos(id: number) {
  return (
    await query<Photo>(
      "SELECT id,property_id,mime_type,file_name,is_primary,sort_order FROM property_photos WHERE property_id=$1 ORDER BY is_primary DESC,sort_order,id",
      [id],
    )
  ).rows;
}
