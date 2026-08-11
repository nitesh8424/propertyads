import pg from "pg";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const x = await pool.query("SELECT COUNT(*)::int count FROM properties");
if (!x.rows[0].count) {
  await pool.query(
    `INSERT INTO properties(title,description,price,location,property_type,area,road_width,facing,availability,email,mobile,latitude,longitude) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13),($14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)`,
    [
      "Agricultural Land – Kalamb",
      "Beautiful agricultural land with good soil quality and excellent road connectivity. Suitable for farming and future investment.",
      1500000,
      "Kalamb, Maharashtra",
      "Agricultural Land",
      "1.5 Acre",
      "20 Feet",
      "East",
      "Available",
      "owner@landhub.com",
      "+91 98765 43210",
      18.9865,
      73.97,
      "Farm Land – Satara Road",
      "Spacious farm land near NH48, ideal for farming or investment with easy access to the main road.",
      2250000,
      "Satara, Maharashtra",
      "Farm Land",
      "3.0 Acre",
      "30 Feet",
      "West",
      "Available",
      "owner@landhub.com",
      "+91 98765 43211",
      17.6805,
      74.0183,
    ],
  );
}
await pool.end();
console.log("Seed complete.");
