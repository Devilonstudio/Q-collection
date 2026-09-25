import { Link } from "react-router-dom";
import RingMark from "./RingMark";
import { formatPrice } from "../lib/api";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const cover = product.images?.[0]?.url;

  return (
    <Link to={`/product/${product.id}`} className="prod-card">
      <div className="prod-card__media">
        {cover ? (
          <img src={cover} alt={product.name} loading="lazy" />
        ) : (
          <div className="prod-card__placeholder">
            <RingMark size={30} />
            <span>Image coming soon</span>
          </div>
        )}
      </div>
      <div className="prod-card__body">
        <span className="prod-card__category">{product.category?.name}</span>
        <h4>{product.name}</h4>
        <div className="prod-card__foot">
          <span className="prod-card__price">{formatPrice(product)}</span>
          <span className="prod-card__view link-underline">View Details</span>
        </div>
      </div>
    </Link>
  );
}
