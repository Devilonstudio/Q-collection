import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Seo from "../components/Seo";
import ProductGrid from "../components/ProductGrid";
import { DataGate } from "../components/DataState";
import { useAsync } from "../hooks/useAsync";
import { getCategories, getProducts } from "../lib/api";
import "./Shop.css";

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: categories, loading: catLoading, error: catError } = useAsync(getCategories, []);
  const { data: products, loading, error } = useAsync(getProducts, []);

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchesCategory = activeCategory === "all" || p.category?.slug === activeCategory;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        (p.category?.name || "").toLowerCase().includes(q.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [products, activeCategory, q]);

  return (
    <section className="shop">
      <Seo
        title="Shop"
        description="Browse the full Q Collection catalogue across bedroom, living room, dining and office furniture."
      />

      <div className="container shop__head">
        <span className="eyebrow">The full catalogue</span>
        <h1>Shop the Collection</h1>
        {products && <p>{filtered.length} pieces{q ? ` matching "${q}"` : ""}</p>}
      </div>

      <DataGate loading={loading || catLoading} error={error || catError} label="Loading the catalogue…">
        <div className="container shop__filters">
          <button
            className={`shop__filter ${activeCategory === "all" ? "shop__filter--active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            All
          </button>
          {(categories || []).map((c) => (
            <button
              key={c.slug}
              className={`shop__filter ${activeCategory === c.slug ? "shop__filter--active" : ""}`}
              onClick={() => setActiveCategory(c.slug)}
            >
              {c.name}
            </button>
          ))}
          {q && (
            <button
              className="shop__clear"
              onClick={() => {
                params.delete("q");
                setParams(params);
              }}
            >
              Clear search &times;
            </button>
          )}
        </div>

        <div className="container">
          <ProductGrid products={filtered} />
        </div>
      </DataGate>
    </section>
  );
}
