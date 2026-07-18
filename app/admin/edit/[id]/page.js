import { notFound } from 'next/navigation';
import { getAdById } from '../../../../lib/ads';
import AdForm from '../../../../components/AdForm';

export default async function EditAdPage({ params }) {
  const ad = await getAdById(params.id);
  if (!ad) {
    notFound();
  }

  const initialAd = {
    title: ad.title,
    description: ad.description,
    price: ad.price,
    property_type: ad.property_type,
    city: ad.city,
    locality: ad.locality || '',
    bedrooms: ad.bedrooms ?? '',
    bathrooms: ad.bathrooms ?? '',
    area_sqft: ad.area_sqft ?? '',
    contact_name: ad.contact_name || '',
    contact_phone: ad.contact_phone || '',
    contact_email: ad.contact_email || '',
    status: ad.status
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit Listing</h1>
      <AdForm mode="edit" adId={ad.id} initialAd={initialAd} initialImages={ad.images} />
    </div>
  );
}
