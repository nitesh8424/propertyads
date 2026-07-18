import AdForm from '../../../components/AdForm';

export default function NewAdPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">New Listing</h1>
      <AdForm mode="create" />
    </div>
  );
}
