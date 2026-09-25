import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import Button from "../components/Button";
import ProductGallery from "../components/ProductGallery";
import ProductGrid from "../components/ProductGrid";
import { DataGate } from "../components/DataState";
import { useAsync } from "../hooks/useAsync";
import { getProduct, getRelatedProducts, formatPrice, getSettings, whatsappLink } from "../lib/api";
import "./ProductPage.css";

const SPEC_LABELS = ["Material", "Finish", "Made to order", "Lead time"];
const SPEC_VALUES = {
  casegood: ["Solid hardwood, brass hardware", "Hand-rubbed dark finish", "Yes", "6–8 weeks"],
  surface: ["Solid hardwood top, brass inlay", "Hand-rubbed dark finish", "Yes", "5–7 weeks"],
  seating: ["Hardwood frame, upholstered", "Fabric or leather, made to order", "Yes", "6–9 weeks"],
};

const TYPOLOGY_BY_CATEGORY = {
  bedroom: "casegood",
  "living-room": "casegood",
  "centre-tables": "surface",
  "sofa-sets": "seating",
  "bedroom-chairs": "seating",
  "office-furniture": "casegood",
  "dining-tables": "surface",
};

export default function ProductPage() {
  const { id } = useParams();
  const { data: product, loading, error } = useAsync(() => getProduct(id), [id]);
  const [related, setRelated] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (product) getRelatedProducts(product, 4).then(setRelated).catch(() => setRelated([]));
  }, [product]);

  useEffect(() => {
    getSettings().then(setSettings).catch(() => setSettings(null));
  }, []);

  if (!loading && !error && product === null) return <Navigate to="/shop" replace />;

  const typology = product ? TYPOLOGY_BY_CATEGORY[product.category?.slug] || "casegood" : "casegood";
  const specValues = SPEC_VALUES[typology];

  return (
    <section className="product">
      <DataGate loading={loading} error={error} label="Loading this piece…">
        {product && (
          <>
            <Seo
              title={product.name}
              description={`${product.description} From the ${product.category?.name} collection at The Q Collection.`}
              image={product.images?.[0]?.url}
            />

            <div className="container product__crumb">
              <Link to="/shop">Shop</Link>
              <span>/</span>
              <Link to={`/collections/${product.category?.slug}`}>{product.category?.name}</Link>
            </div>

            <div className="container product__layout">
              <ProductGallery images={product.images || []} alt={product.name} />

              <div className="product__info">
                <span className="product__category">{product.category?.name}</span>
                <h1>{product.name}</h1>
                <span className="product__price">{formatPrice(product)}</span>
                <p className="product__desc">{product.description}</p>

                <div className="product__actions">
                  <Button href={whatsappLink(settings, `Hi, I'd like to enquire about the ${product.name}.`)}>
                    Enquire Now
                  </Button>
                  <Button
                    href={whatsappLink(settings, `Hi, I'd like to enquire about the ${product.name} on WhatsApp.`)}
                    variant="ghost"
                  >
                    WhatsApp Us
                  </Button>
                </div>

                <dl className="product__specs">
                  {SPEC_LABELS.map((label, i) => (
                    <div key={label} className="product__spec">
                      <dt>{label}</dt>
                      <dd>{specValues[i]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {related.length > 0 && (
              <div className="container product__related">
                <h2>You may also like</h2>
                <ProductGrid products={related} />
              </div>
            )}
          </>
        )}
      </DataGate>
    </section>
  );
}
