import { query } from './db';

export async function listAds({ city, minPrice, maxPrice, propertyType, status = 'active' } = {}) {
  let sql = 'SELECT * FROM ads WHERE 1=1';
  const params = [];

  if (status) {
    params.push(status);
    sql += ` AND status = $${params.length}`;
  }
  if (city) {
    params.push(`%${city}%`);
    sql += ` AND city ILIKE $${params.length}`;
  }
  if (propertyType) {
    params.push(propertyType);
    sql += ` AND property_type = $${params.length}`;
  }
  if (minPrice) {
    params.push(Number(minPrice));
    sql += ` AND price >= $${params.length}`;
  }
  if (maxPrice) {
    params.push(Number(maxPrice));
    sql += ` AND price <= $${params.length}`;
  }

  sql += ' ORDER BY created_at DESC';

  const { rows } = await query(sql, params);
  return Promise.all(rows.map(attachThumbnail));
}

async function attachThumbnail(ad) {
  const { rows } = await query(
    'SELECT filename FROM ad_images WHERE ad_id = $1 ORDER BY sort_order ASC, id ASC LIMIT 1',
    [ad.id]
  );
  return { ...ad, thumbnail: rows[0] ? rows[0].filename : null };
}

export async function getAdById(id) {
  const { rows } = await query('SELECT * FROM ads WHERE id = $1', [id]);
  const ad = rows[0];
  if (!ad) return null;

  const imagesResult = await query(
    'SELECT id, filename FROM ad_images WHERE ad_id = $1 ORDER BY sort_order ASC, id ASC',
    [id]
  );
  return { ...ad, images: imagesResult.rows };
}

export async function createAd(data) {
  const { rows } = await query(
    `INSERT INTO ads (
      title, description, price, property_type, city, locality,
      bedrooms, bathrooms, area_sqft, contact_name, contact_phone, contact_email, status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING id`,
    [
      data.title,
      data.description,
      data.price,
      data.property_type,
      data.city,
      data.locality || null,
      data.bedrooms || null,
      data.bathrooms || null,
      data.area_sqft || null,
      data.contact_name || null,
      data.contact_phone || null,
      data.contact_email || null,
      data.status || 'active'
    ]
  );
  return rows[0].id;
}

export async function updateAd(id, data) {
  await query(
    `UPDATE ads SET
      title = $1, description = $2, price = $3, property_type = $4, city = $5, locality = $6,
      bedrooms = $7, bathrooms = $8, area_sqft = $9, contact_name = $10, contact_phone = $11,
      contact_email = $12, status = $13, updated_at = NOW()
    WHERE id = $14`,
    [
      data.title,
      data.description,
      data.price,
      data.property_type,
      data.city,
      data.locality || null,
      data.bedrooms || null,
      data.bathrooms || null,
      data.area_sqft || null,
      data.contact_name || null,
      data.contact_phone || null,
      data.contact_email || null,
      data.status || 'active',
      id
    ]
  );
}

export async function deleteAd(id) {
  await query('DELETE FROM ads WHERE id = $1', [id]);
}

export async function addAdImage(adId, filename, sortOrder = 0) {
  await query('INSERT INTO ad_images (ad_id, filename, sort_order) VALUES ($1, $2, $3)', [
    adId,
    filename,
    sortOrder
  ]);
}

export async function getAdImageById(imageId) {
  const { rows } = await query('SELECT * FROM ad_images WHERE id = $1', [imageId]);
  return rows[0];
}

export async function deleteAdImage(imageId) {
  await query('DELETE FROM ad_images WHERE id = $1', [imageId]);
}
