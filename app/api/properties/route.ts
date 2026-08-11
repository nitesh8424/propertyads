import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
export const runtime = "nodejs";
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const name = params.get("name") || "";
  const location = params.get("location") || "";
  const r = await query(
    `SELECT p.*,ph.id primary_photo_id FROM properties p LEFT JOIN LATERAL(SELECT id FROM property_photos WHERE property_id=p.id ORDER BY is_primary DESC,sort_order,id LIMIT 1)ph ON TRUE WHERE($1='' OR p.title ILIKE '%'||$1||'%') AND ($2='' OR p.location ILIKE '%'||$2||'%') ORDER BY p.created_at DESC`,
    [name, location],
  );
  return NextResponse.json(r.rows);
}
export async function POST(req: Request) {
  try {
    const fd = await req.formData();
    const title = String(fd.get("title") || "").trim(),
      description = String(fd.get("description") || "").trim(),
      location = String(fd.get("location") || "").trim(),
      email = String(fd.get("email") || "").trim(),
      mobile = String(fd.get("mobile") || "").trim(),
      price = Number(fd.get("price"));
    if (
      !title ||
      !description ||
      !location ||
      !email ||
      !mobile ||
      !Number.isFinite(price)
    )
      return NextResponse.json(
        { error: "Please fill all required fields, including price." },
        { status: 400 },
      );
    const p = await query<{ id: number }>(
      `INSERT INTO properties(title,description,price,location,property_type,area,road_width,facing,availability,email,mobile,latitude,longitude) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
      [
        title,
        description,
        price,
        location,
        String(fd.get("propertyType") || "Agricultural Land"),
        String(fd.get("area") || ""),
        String(fd.get("roadWidth") || ""),
        String(fd.get("facing") || ""),
        String(fd.get("availability") || "Available"),
        email,
        mobile,
        fd.get("latitude") ? Number(fd.get("latitude")) : null,
        fd.get("longitude") ? Number(fd.get("longitude")) : null,
      ],
    );
    const id = p.rows[0].id;
    const files = [fd.get("mainPhoto"), ...fd.getAll("otherPhotos")].filter(
      (x) => x instanceof File && x.size > 0,
    ) as File[];
    if (!files.length)
      return NextResponse.json(
        { error: "Main property photo is required." },
        { status: 400 },
      );
    for (let i = 0; i < files.length; i++) {
      if (!files[i].type.startsWith("image/")) continue;
      if (files[i].size > 10 * 1024 * 1024)
        return NextResponse.json(
          { error: `${files[i].name} is larger than 10MB.` },
          { status: 400 },
        );
      const buf = Buffer.from(await files[i].arrayBuffer());
      await query(
        "INSERT INTO property_photos(property_id,data,mime_type,file_name,is_primary,sort_order) VALUES($1,$2,$3,$4,$5,$6)",
        [id, buf, files[i].type, files[i].name, i === 0, i],
      );
    }
    return NextResponse.json({ id }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Database or upload error." },
      { status: 500 },
    );
  }
}
