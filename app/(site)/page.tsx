import SearchBar from "../../components/search-bar";
import PropertyCard from "../../components/property-card";
import { getProperties } from "../../lib/properties";
export const dynamic = "force-dynamic";
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; location?: string }>;
}) {
  const sp = await searchParams;
  const properties = await getProperties(sp.name || "", sp.location || "");
  return (
    <main>
      <section className="hero">
        <div className="heroOverlay">
          <span>Find Your Perfect Land</span>
          <h1>
            Find Your <strong>Perfect</strong>
            <br />
            Property for You
          </h1>
          <p>Explore verified land properties in the best locations.</p>
          <SearchBar />
        </div>
      </section>
      <section className="section" id="properties">
        <div className="sectionHead">
          <h2>Featured Properties</h2>
          <p>Explore our handpicked properties in prime locations.</p>
        </div>
        {properties.length ? (
          <div className="cards">
            {properties.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className="empty">No properties found. Try another search.</div>
        )}
      </section>
      <section className="listingCta">
        <div>
          🏡 <b>Want to list your property with us?</b>
          <small>
            Reach thousands of potential buyers by listing your property.
          </small>
        </div>
        <a href="/contact">Contact Us</a>
      </section>
    </main>
  );
}
