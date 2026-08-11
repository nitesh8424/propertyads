import { notFound } from "next/navigation";
import Link from "next/link";
import PropertyGallery from "../../../../components/property-gallery";
import { getPhotos, getProperty } from "../../../../lib/properties";
import { money } from "../../../../lib/format";
export const dynamic = "force-dynamic";
export default async function Details({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const n = Number(id);
  if (!Number.isInteger(n)) notFound();
  const p = await getProperty(n);
  if (!p) notFound();
  console.log("p", p);
  const photos = await getPhotos(n);
  return (
    <main className="detailsPage">
      <Link href="/" className="back">
        ‹ Back to Properties
      </Link>
      <div className="detailsTop">
        <PropertyGallery photos={photos} title={p.title} />
        <aside className="sideInfo">
          <h1>{p.title}</h1>
          <p>⌖ {p.location}</p>
          <h2>{money(p.price)}</h2>
          <dl>
            <div>
              <dt>Property Type</dt>
              <dd>{p.property_type}</dd>
            </div>
            <div>
              <dt>Area</dt>
              <dd>{p.area || "—"}</dd>
            </div>
            <div>
              <dt>Facing</dt>
              <dd>{p.facing || "—"}</dd>
            </div>
            <div>
              <dt>Road Width</dt>
              <dd>{p.road_width || "—"}</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>{p.availability}</dd>
            </div>
          </dl>
          <div className="owner">
            <b>Contact Owner</b>
            <a href={`mailto:${p.email}`}>✉ {p.email}</a>
            <a href={`tel:${p.mobile}`}>☎ {p.mobile}</a>
            <a className="greenBtn" href={`tel:${p.mobile}`}>
              Contact Now
            </a>
          </div>
        </aside>
      </div>
      <div className="detailsBottom">
        <section>
          <h3>Property Description</h3>
          <p>{p.description}</p>
          <h3>Property Highlights</h3>
          <div className="highlights">
            <span>✓ Good Soil Quality</span>
            <span>✓ Clear Title Property</span>
            <span>✓ Water Facility Available</span>
            <span>✓ Documents Available</span>
            <span>✓ Electricity Connection</span>
            <span>✓ Suitable for Farming</span>
            <span>✓ Road Connectivity</span>
            <span>✓ Peaceful Location</span>
          </div>
        </section>
        <section>
          <h3>Location</h3>

          {p.latitude != null && p.longitude != null ? (
            <iframe
              className="map"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                Number(p.longitude) - 0.05
              }%2C${Number(p.latitude) - 0.05}%2C${
                Number(p.longitude) + 0.05
              }%2C${Number(p.latitude) + 0.05}&layer=mapnik&marker=${Number(
                p.latitude,
              )}%2C${Number(p.longitude)}`}
              loading="lazy"
            />
          ) : (
            <div className="mapFallback">Location: {p.location}</div>
          )}
        </section>
      </div>
    </main>
  );
}
