'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'plot', 'commercial'];

const emptyAd = {
  title: '',
  description: '',
  price: '',
  property_type: 'apartment',
  city: '',
  locality: '',
  bedrooms: '',
  bathrooms: '',
  area_sqft: '',
  contact_name: '',
  contact_phone: '',
  contact_email: '',
  status: 'active'
};

export default function AdForm({ mode, adId, initialAd, initialImages = [] }) {
  const router = useRouter();
  const [form, setForm] = useState(initialAd || emptyAd);
  const [images, setImages] = useState(initialImages);
  const [newFiles, setNewFiles] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      ...form,
      price: Number(form.price),
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      area_sqft: form.area_sqft ? Number(form.area_sqft) : null
    };

    const url = mode === 'edit' ? `/api/ads/${adId}` : '/api/ads';
    const method = mode === 'edit' ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Failed to save listing.');
      setSaving(false);
      return;
    }

    const data = await res.json();
    const targetAdId = mode === 'edit' ? adId : data.id;

    if (newFiles.length > 0) {
      const uploadData = new FormData();
      uploadData.set('adId', targetAdId);
      for (const file of newFiles) uploadData.append('images', file);

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
      if (!uploadRes.ok) {
        const uploadErr = await uploadRes.json().catch(() => ({}));
        setError(uploadErr.error || 'Listing saved, but image upload failed.');
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    router.push('/admin');
    router.refresh();
  }

  async function handleDeleteImage(imageId) {
    if (!confirm('Remove this image?')) return;
    const res = await fetch(`/api/images/${imageId}`, { method: 'DELETE' });
    if (res.ok) {
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } else {
      alert('Failed to remove image.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card space-y-4 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
          <input
            className="input"
            required
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
          <textarea
            className="input"
            rows={5}
            required
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Price (INR)</label>
            <input
              className="input"
              type="number"
              min="0"
              required
              value={form.price}
              onChange={(e) => updateField('price', e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Property Type</label>
            <select
              className="input"
              value={form.property_type}
              onChange={(e) => updateField('property_type', e.target.value)}
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
            <select
              className="input"
              value={form.status}
              onChange={(e) => updateField('status', e.target.value)}
            >
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">City</label>
            <input
              className="input"
              required
              value={form.city}
              onChange={(e) => updateField('city', e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Locality</label>
            <input
              className="input"
              value={form.locality}
              onChange={(e) => updateField('locality', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Bedrooms</label>
            <input
              className="input"
              type="number"
              min="0"
              value={form.bedrooms}
              onChange={(e) => updateField('bedrooms', e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Bathrooms</label>
            <input
              className="input"
              type="number"
              min="0"
              value={form.bathrooms}
              onChange={(e) => updateField('bathrooms', e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Area (sqft)</label>
            <input
              className="input"
              type="number"
              min="0"
              value={form.area_sqft}
              onChange={(e) => updateField('area_sqft', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card space-y-4 p-6">
        <h2 className="font-semibold text-slate-900">Contact Info</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <input
            className="input"
            placeholder="Contact name"
            value={form.contact_name}
            onChange={(e) => updateField('contact_name', e.target.value)}
          />
          <input
            className="input"
            placeholder="Phone"
            value={form.contact_phone}
            onChange={(e) => updateField('contact_phone', e.target.value)}
          />
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={form.contact_email}
            onChange={(e) => updateField('contact_email', e.target.value)}
          />
        </div>
      </div>

      <div className="card space-y-4 p-6">
        <h2 className="font-semibold text-slate-900">Photos</h2>

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {images.map((image) => (
              <div key={image.id} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/uploads/${image.filename}`}
                  alt="Listing"
                  className="aspect-square w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(image.id)}
                  className="absolute right-1 top-1 rounded-full bg-red-600 px-2 py-0.5 text-xs font-medium text-white"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Add photos (JPEG, PNG, WebP - max 5MB each)
          </label>
          <input
            className="input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => setNewFiles(Array.from(e.target.files || []))}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Listing'}
        </button>
        <button type="button" className="btn-secondary" onClick={() => router.push('/admin')}>
          Cancel
        </button>
      </div>
    </form>
  );
}
