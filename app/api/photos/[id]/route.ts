import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const r = await query<{ data: Buffer; mime_type: string }>(
    `SELECT data,mime_type FROM property_photos WHERE id=$1`,
    [Number(id)],
  );
  if (!r.rows[0]) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(r.rows[0].data, {
    headers: {
      "Content-Type": r.rows[0].mime_type,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
