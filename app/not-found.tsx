import Link from "next/link";
export default function NotFound() {
  return (
    <main className="notFound">
      <h1>Property not found</h1>
      <p>The property may have been removed or the link is incorrect.</p>
      <Link href="/" className="greenBtn">
        Back Home
      </Link>
    </main>
  );
}
