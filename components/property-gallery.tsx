"use client";
import { useState } from "react";
import type { Photo } from "../lib/types";
export default function PropertyGallery({
  photos,
  title,
}: {
  photos: Photo[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const [modal, setModal] = useState(false);
  if (!photos.length)
    return <div className="galleryEmpty">No photos uploaded yet.</div>;
  return (
    <>
      <div className="gallery">
        <button className="mainPhoto" onClick={() => setModal(true)}>
          <img src={`/api/photos/${photos[active].id}`} alt={title} />
          <em>
            {active + 1} / {photos.length}
          </em>
        </button>
        <div className="thumbs">
          {photos.map((x, i) => (
            <button
              key={x.id}
              className={i === active ? "selected" : ""}
              onClick={() => setActive(i)}
            >
              <img src={`/api/photos/${x.id}`} alt="" />
            </button>
          ))}
        </div>
      </div>
      {modal && (
        <div className="modal" onClick={() => setModal(false)}>
          <button className="close" onClick={() => setModal(false)}>
            ×
          </button>
          <button
            className="arrow left"
            onClick={(e) => {
              e.stopPropagation();
              setActive((active - 1 + photos.length) % photos.length);
            }}
          >
            ‹
          </button>
          <img
            src={`/api/photos/${photos[active].id}`}
            alt={title}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="arrow right"
            onClick={(e) => {
              e.stopPropagation();
              setActive((active + 1) % photos.length);
            }}
          >
            ›
          </button>
          <span>
            {active + 1} / {photos.length}
          </span>
        </div>
      )}
    </>
  );
}
