CREATE TABLE IF NOT EXISTS properties (
  id BIGSERIAL PRIMARY KEY, title VARCHAR(180) NOT NULL, description TEXT NOT NULL, price NUMERIC(14,2) NOT NULL DEFAULT 0,
  location VARCHAR(255) NOT NULL, property_type VARCHAR(80) NOT NULL DEFAULT 'Agricultural Land', area VARCHAR(80) NOT NULL DEFAULT '',
  road_width VARCHAR(80) NOT NULL DEFAULT '', facing VARCHAR(50) NOT NULL DEFAULT '', availability VARCHAR(80) NOT NULL DEFAULT 'Available',
  email VARCHAR(255) NOT NULL, mobile VARCHAR(40) NOT NULL, latitude NUMERIC(10,7), longitude NUMERIC(10,7), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS property_photos (
  id BIGSERIAL PRIMARY KEY, property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE, data BYTEA NOT NULL, mime_type VARCHAR(100) NOT NULL,
  file_name VARCHAR(255) NOT NULL, is_primary BOOLEAN NOT NULL DEFAULT FALSE, sort_order INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS contact_messages (id BIGSERIAL PRIMARY KEY, name VARCHAR(160) NOT NULL, email VARCHAR(255) NOT NULL, mobile VARCHAR(40) NOT NULL, message TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE INDEX IF NOT EXISTS idx_properties_title ON properties USING GIN (to_tsvector('simple', title));
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties USING GIN (to_tsvector('simple', location));
CREATE INDEX IF NOT EXISTS idx_photos_property ON property_photos(property_id, sort_order);
