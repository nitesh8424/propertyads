'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAds();
  }, []);

  async function loadAds() {
    setLoading(true);
    const res = await fetch('/api/ads?status=all');
    if (res.ok) {
      const data = await res.json();
      setAds(data.ads);
    } else {
      setError('Failed to load listings.');
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    const res = await fetch(`/api/ads/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setAds((prev) => prev.filter((ad) => ad.id !== id));
    } else {
      alert('Failed to delete listing.');
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link href="/admin/new" className="btn-primary">
            + New Listing
          </Link>
          <button onClick={handleLogout} className="btn-secondary">
            Log out
          </button>
        </div>
      </div>

      {loading && <p className="text-slate-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && ads.length === 0 && (
        <p className="text-slate-500">No listings yet. Create your first one.</p>
      )}

      {!loading && ads.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">{ad.title}</td>
                  <td className="px-4 py-3 text-slate-600">{ad.city}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0
                    }).format(Number(ad.price))}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        ad.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {ad.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/edit/${ad.id}`} className="text-brand-600 hover:underline">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
