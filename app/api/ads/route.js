import { NextResponse } from 'next/server';
import { listAds, createAd } from '../../../lib/ads';
import { getAdminFromRequest } from '../../../lib/auth';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const admin = await getAdminFromRequest(request);

  // Public visitors only ever see active listings. An authenticated admin can
  // pass status=all to manage every listing, including sold/inactive ones.
  const requestedStatus = searchParams.get('status');
  const status = admin && requestedStatus === 'all' ? undefined : admin && requestedStatus ? requestedStatus : 'active';

  const ads = await listAds({
    city: searchParams.get('city') || undefined,
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
    propertyType: searchParams.get('propertyType') || undefined,
    status
  });

  return NextResponse.json({ ads });
}

export async function POST(request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.description || !body?.price || !body?.property_type || !body?.city) {
    return NextResponse.json(
      { error: 'title, description, price, property_type and city are required.' },
      { status: 400 }
    );
  }

  const id = await createAd(body);
  return NextResponse.json({ id }, { status: 201 });
}
