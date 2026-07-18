import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getAdminFromRequest } from '../../../lib/auth';
import { addAdImage, getAdById } from '../../../lib/ads';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB per image

export async function POST(request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const formData = await request.formData();
  const adId = formData.get('adId');
  const files = formData.getAll('images');

  if (!adId || !(await getAdById(adId))) {
    return NextResponse.json({ error: 'Valid adId is required.' }, { status: 400 });
  }
  if (!files.length) {
    return NextResponse.json({ error: 'No images provided.' }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  fs.mkdirSync(uploadsDir, { recursive: true });

  const savedFilenames = [];

  for (const file of files) {
    if (!(file instanceof File)) continue;
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Use JPEG, PNG or WebP.` },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: `${file.name} exceeds the 5MB limit.` }, { status: 400 });
    }

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const filename = `${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(uploadsDir, filename), buffer);

    await addAdImage(adId, filename);
    savedFilenames.push(filename);
  }

  return NextResponse.json({ ok: true, files: savedFilenames });
}
