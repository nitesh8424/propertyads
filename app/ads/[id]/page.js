import { notFound } from 'next/navigation';
import { getAdById } from '../../../lib/ads';

export const dynamic = 'force-dynamic';

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(price));
}

export default async function AdDetailPage({ params }) {
  const ad = await getAdById(params.id);
  if (!ad || ad.status !== 'active') {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {ad.images.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {ad.images.map((image) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={image.id}
                src={`/uploads/${image.filename}`}
                alt={ad.title}
                className="aspect-square w-full rounded-lg object-cover"
              />
            ))}
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-lg bg-slate-100 text-slate-400">
            No images uploaded for this listing
          </div>
        )}

        <h1 className="mt-6 text-2xl font-bold text-slate-900">{ad.title}</h1>
        <p className="mt-1 text-slate-500">
          {ad.city}
          {ad.locality ? `, ${ad.locality}` : ''}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-4">
          <Stat label="Type" value={ad.property_type} />
          <Stat label="Bedrooms" value={ad.bedrooms ?? '-'} />
          <Stat label="Bathrooms" value={ad.bathrooms ?? '-'} />
          <Stat label="Area" value={ad.area_sqft ? `${ad.area_sqft} sqft` : '-'} />
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-slate-900">Description</h2>
          <p className="mt-2 whitespace-pre-line text-slate-700">{ad.description}</p>
        </div>
      </div>

      <div className="card h-fit p-5">
        <p className="text-2xl font-bold text-brand-700">{formatPrice(ad.price)}</p>
        <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Contact
        </h2>
        <dl className="mt-2 space-y-1 text-sm text-slate-700">
          {ad.contact_name && (
            <div>
              <dt className="inline font-medium">Name: </dt>
              <dd className="inline">{ad.contact_name}</dd>
            </div>
          )}
          {ad.contact_phone && (
            <div>
              <dt className="inline font-medium">Phone: </dt>
              <dd className="inline">{ad.contact_phone}</dd>
            </div>
          )}
          {ad.contact_email && (
            <div>
              <dt className="inline font-medium">Email: </dt>
              <dd className="inline">{ad.contact_email}</dd>
            </div>
          )}
          {!ad.contact_name && !ad.contact_phone && !ad.contact_email && (
            <p className="text-slate-400">No contact info provided.</p>
          )}
        </dl>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="font-medium text-slate-800">{value}</p>
    </div>
  );
}
