import { useState } from "react";
import RingMark from "./RingMark";
import "./ProductGallery.css";

export default function ProductGallery({ images, alt }) {
  const [active, setActive] = useState(0);
  const urls = images.map((img) => (typeof img === "string" ? img : img.url));

  if (!urls.length) {
    return (
      <div className="gallery">
        <div className="gallery__main gallery__main--empty">
          <RingMark size={54} />
          <span>Images coming soon</span>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery">
      <div className="gallery__main">
        <img src={urls[active]} alt={alt} />
      </div>
      {urls.length > 1 && (
        <div className="gallery__thumbs">
          {urls.map((src, i) => (
            <button
              key={src}
              className={`gallery__thumb ${i === active ? "gallery__thumb--active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${urls.length}`}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
