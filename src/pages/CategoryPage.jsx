import { Link, Navigate, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import ProductGrid from "../components/ProductGrid";
import { DataGate } from "../components/DataState";
import { useAsync } from "../hooks/useAsync";
import { getCategories, getCategory, getProductsByCategory } from "../lib/api";
import "./CategoryPage.css";

export default function CategoryPage() {
  const { slug } = useParams();

  const { data: category, loading: catLoading, error: catError } = useAsync(() => getCategory(slug), [slug]);
  const { data: allCategories } = useAsync(getCategories, []);
  const { data: products, loading: prodLoading, error: prodError } = useAsync(
    () => getProductsByCategory(slug),
    [slug]
  );

  if (!catLoading && !catError && category === null) return <Navigate to="/shop" replace />;

  const index = allCategories ? allCategories.findIndex((c) => c.slug === slug) : -1;
  const prev = allCategories && index >= 0 ? allCategories[(index - 1 + allCategories.length) % allCategories.length] : null;
  const next = allCategories && index >= 0 ? allCategories[(index + 1) % allCategories.length] : null;

  return (
    <section className="collection">
      <DataGate loading={catLoading} error={catError} label="Loading the collection…">
        {category && (
          <>
            <Seo
              title={category.name}
              description={`${category.description} Browse pieces in the ${category.name} collection from The Q Collection.`}
            />

            <div className="container collection__head">
              <Link to="/shop" className="collection__back">
                &larr; All collections
              </Link>
              <h1>{category.name}</h1>
              <p>{category.description}</p>
              {products && <span className="collection__count">{products.length} pieces</span>}
            </div>

            <div className="container">
              <DataGate loading={prodLoading} error={prodError}>
                <ProductGrid products={products || []} />
              </DataGate>
            </div>

            {prev && next && (
              <div className="container collection__nav">
                <Link to={`/collections/${prev.slug}`} className="collection__nav-link">
                  <span className="collection__nav-label">Previous room</span>
                  <span>{prev.name}</span>
                </Link>
                <Link
                  to={`/collections/${next.slug}`}
                  className="collection__nav-link collection__nav-link--right"
                >
                  <span className="collection__nav-label">Next room</span>
                  <span>{next.name}</span>
                </Link>
              </div>
            )}
          </>
        )}
      </DataGate>
    </section>
  );
}
