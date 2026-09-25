import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getCategories, getProducts } from "../lib/api";
import { DataGate } from "../components/DataState";

export default function Dashboard() {
  const { data: categories, loading: catLoading, error: catError } = useAsync(getCategories, []);
  const { data: products, loading: prodLoading, error: prodError } = useAsync(getProducts, []);

  const imageCount = (products || []).reduce((sum, p) => sum + (p.images?.length || 0), 0);
  const missingImages = (products || []).filter((p) => !p.images?.length).length;

  return (
    <div>
      <div className="admin-page__head">
        <div>
          <h1>Dashboard</h1>
          <p>An overview of what's live on the site.</p>
        </div>
      </div>

      <DataGate loading={catLoading || prodLoading} error={catError || prodError}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "40px" }}>
          <StatCard label="Categories" value={categories?.length ?? 0} />
          <StatCard label="Products" value={products?.length ?? 0} />
          <StatCard label="Images uploaded" value={imageCount} />
          <StatCard label="Products missing a photo" value={missingImages} />
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link className="admin-btn" to="/admin/categories/new">+ New Category</Link>
          <Link className="admin-btn admin-btn--ghost" to="/admin/products/new">+ New Product</Link>
          <Link className="admin-btn admin-btn--ghost" to="/admin/settings">Edit Site Settings</Link>
        </div>
      </DataGate>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ border: "1px solid var(--line-soft)", padding: "22px" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--gold-soft)" }}>{value}</div>
      <div style={{ fontSize: "0.82rem", color: "var(--ivory-dim)", marginTop: "6px" }}>{label}</div>
    </div>
  );
}
