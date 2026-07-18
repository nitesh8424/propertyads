import Link from 'next/link';
import { listAds } from '../lib/ads';

export const dynamic = 'force-dynamic';

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(price));
}

export default async function HomePage({ searchParams }) {
  const { city, minPrice, maxPrice, propertyType } = searchParams;

  const ads = await listAds({ city, minPrice, maxPrice, propertyType, status: 'active' });

  return (
    <div>
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <form className="grid grid-cols-1 gap-3 sm:grid-cols-5">
          <input
            className="input sm:col-span-2"
            type="text"
            name="city"
            placeholder="City"
            defaultValue={city || ''}
          />
          <select className="input" name="propertyType" defaultValue={propertyType || ''}>
            <option value="">Any type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="plot">Plot</option>
            <option value="commercial">Commercial</option>
          </select>
          <input
            className="input"
            type="number"
            name="minPrice"
            placeholder="Min price"
            defaultValue={minPrice || ''}
          />
          <input
            className="input"
            type="number"
            name="maxPrice"
            placeholder="Max price"
            defaultValue={maxPrice || ''}
          />
          <button type="submit" className="btn-primary sm:col-span-5">
            Search
          </button>
        </form>
      </div>

      {ads.length === 0 ? (
        <p className="text-center text-slate-500">No listings match your search yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ads.map((ad) => (
            <Link
              key={ad.id}
              href={`/ads/${ad.id}`}
              className="card overflow-hidden transition-shadow hover:shadow-md"
            >
              <div className="aspect-[4/3] w-full bg-slate-100">
                {ad.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/uploads/${ad.thumbnail}`}
                    alt={ad.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    No image
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-lg font-semibold text-brand-700">{formatPrice(ad.price)}</p>
                <h3 className="mt-1 truncate font-medium text-slate-900">{ad.title}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {ad.city}
                  {ad.locality ? `, ${ad.locality}` : ''}
                </p>
                <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
                  {ad.property_type}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
