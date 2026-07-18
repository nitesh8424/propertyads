export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Not found</h1>
      <p className="mt-2 text-slate-500">The listing or page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary mt-6 inline-flex">
        Back to listings
      </a>
    </div>
  );
}
