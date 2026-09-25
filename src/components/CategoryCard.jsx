import { Link } from "react-router-dom";
import RingMark from "./RingMark";
import "./CategoryCard.css";

export default function CategoryCard({ category, index, wide }) {
  const cover = category.cover;

  return (
    <Link to={`/collections/${category.slug}`} className={`cat-card ${wide ? "cat-card--wide" : ""}`}>
      <div className="cat-card__media">
        {cover ? (
          <img src={cover} alt={category.name} loading="lazy" />
        ) : (
          <div className="cat-card__placeholder">
            <RingMark size={40} />
          </div>
        )}
        <span className="cat-card__index">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="cat-card__body">
        <h3>{category.name}</h3>
        <p>{category.tagline}</p>
        <span className="cat-card__link link-underline">Explore Collection</span>
      </div>
    </Link>
  );
}
