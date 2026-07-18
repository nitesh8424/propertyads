import '../styles/globals.css';

export const metadata = {
  title: 'PropertyAds - Property Sale Listings',
  description: 'Browse property sale listings posted by our team.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <a href="/" className="text-xl font-bold text-brand-700">
              PropertyAds
            </a>
            <nav className="flex gap-4 text-sm font-medium text-slate-600">
              <a href="/" className="hover:text-brand-600">
                Browse Listings
              </a>
              <a href="/admin" className="hover:text-brand-600">
                Admin
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="mt-16 border-t border-slate-200 py-6 text-center text-sm text-slate-500">
          Listings are posted by our admin team only.
        </footer>
      </body>
    </html>
  );
}
