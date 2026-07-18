import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAdById, updateAd, deleteAd } from '../../../../lib/ads';
import { getAdminFromRequest } from '../../../../lib/auth';

export async function GET(_request, { params }) {
  const ad = await getAdById(params.id);
  if (!ad) {
    return NextResponse.json({ error: 'Ad not found.' }, { status: 404 });
  }
  return NextResponse.json({ ad });
}

export async function PUT(request, { params }) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const existing = await getAdById(params.id);
  if (!existing) {
    return NextResponse.json({ error: 'Ad not found.' }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.description || !body?.price || !body?.property_type || !body?.city) {
    return NextResponse.json(
      { error: 'title, description, price, property_type and city are required.' },
      { status: 400 }
    );
  }

  await updateAd(params.id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const ad = await getAdById(params.id);
  if (!ad) {
    return NextResponse.json({ error: 'Ad not found.' }, { status: 404 });
  }

  // Remove the uploaded image files from disk. The ad_images rows are removed
  // automatically by the ON DELETE CASCADE foreign key when the ad row goes.
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  for (const image of ad.images) {
    const filePath = path.join(uploadsDir, image.filename);
    fs.rm(filePath, { force: true }, () => {});
  }

  await deleteAd(params.id);

  return NextResponse.json({ ok: true });
}
