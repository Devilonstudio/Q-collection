import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getFeaturedProducts, formatPrice } from "../lib/api";
import { DataGate } from "./DataState";
import RingMark from "./RingMark";
import SectionTitle from "./SectionTitle";
import "./FeaturedCollection.css";

export default function FeaturedCollection() {
  const { data: products, loading, error } = useAsync(() => getFeaturedProducts(5), []);

  if (!loading && !error && (!products || products.length === 0)) return null;

  const [lead, ...rest] = products || [];

  return (
    <section className="section featured">
      <div className="container">
        <SectionTitle eyebrow="Curated by the showroom" title="This season's featured pieces.">
          A short, changing edit pulled from across the collection — the
          pieces our showroom keeps returning to.
        </SectionTitle>

        <DataGate loading={loading} error={error} label="Loading featured pieces…">
          {lead && (
            <div className="featured__layout">
              <Link to={`/product/${lead.id}`} className="featured__lead">
                <div className="featured__lead-media">
                  {lead.images?.[0] ? (
                    <img src={lead.images[0].url} alt={lead.name} />
                  ) : (
                    <div className="featured__placeholder">
                      <RingMark size={44} />
                    </div>
                  )}
                </div>
                <div className="featured__lead-body">
                  <span>{lead.category?.name}</span>
                  <h3>{lead.name}</h3>
                  <p>{lead.description}</p>
                  <span className="featured__price">{formatPrice(lead)}</span>
                </div>
              </Link>

              <div className="featured__side">
                {rest.map((product) => (
                  <Link to={`/product/${product.id}`} key={product.id} className="featured__row">
                    <div className="featured__row-media">
                      {product.images?.[0] ? (
                        <img src={product.images[0].url} alt={product.name} loading="lazy" />
                      ) : (
                        <div className="featured__placeholder featured__placeholder--small">
                          <RingMark size={24} />
                        </div>
                      )}
                    </div>
                    <div className="featured__row-body">
                      <span>{product.category?.name}</span>
                      <h4>{product.name}</h4>
                      <span className="featured__price">{formatPrice(product)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </DataGate>
      </div>
    </section>
  );
}
