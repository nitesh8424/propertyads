import Link from "next/link";
import type { Property } from "../lib/types";
import { money } from "../lib/format";
export default function PropertyCard({ p }: { p: Property }) {
  return (
    <article className="card">
      <div className="cardImg">
        {p.primary_photo_id ? (
          <img src={`/api/photos/${p.primary_photo_id}`} alt={p.title} />
        ) : (
          <div className="placeholder">Land</div>
        )}
        <span>For Sale</span>
        <i>♡</i>
      </div>
      <div className="cardBody">
        <h3>{p.title}</h3>
        <small>⌖ {p.location}</small>
        <p>{p.description}</p>
        <div className="cardMeta">
          <b>{money(p.price)}</b>
          <small>{p.area}</small>
        </div>
        <Link href={`/properties/${p.id}`} className="greenBtn">
          View Details
        </Link>
      </div>
    </article>
  );
}
