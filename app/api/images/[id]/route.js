import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAdImageById, deleteAdImage } from '../../../../lib/ads';
import { getAdminFromRequest } from '../../../../lib/auth';

export async function DELETE(request, { params }) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const image = await getAdImageById(params.id);
  if (!image) {
    return NextResponse.json({ error: 'Image not found.' }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), 'public', 'uploads', image.filename);
  fs.rm(filePath, { force: true }, () => {});
  await deleteAdImage(params.id);

  return NextResponse.json({ ok: true });
}
