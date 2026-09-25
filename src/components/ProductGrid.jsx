import ProductCard from "./ProductCard";
import "./ProductGrid.css";

export default function ProductGrid({ products, emptyMessage = "No pieces match that search yet." }) {
  if (!products.length) {
    return <p className="prod-grid__empty">{emptyMessage}</p>;
  }

  return (
    <div className="prod-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
