import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, getCategories, deleteProduct, formatPrice } from "../lib/api";
import { DataGate } from "../components/DataState";

export default function ProductsList() {
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState("all");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    setBusyId(product.id);
    try {
      await deleteProduct(product.id);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const filtered = (products || []).filter((p) => filter === "all" || p.category?.slug === filter);

  return (
    <div>
      <div className="admin-page__head">
        <div>
          <h1>Products</h1>
          <p>{products ? `${products.length} total` : ""}</p>
        </div>
        <Link className="admin-btn" to="/admin/products/new">+ New Product</Link>
      </div>

      <DataGate loading={loading} error={error}>
        <div style={{ marginBottom: "24px" }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              background: "var(--green-900)",
              border: "1px solid var(--line-soft)",
              color: "var(--ivory)",
              padding: "9px 14px",
              fontSize: "0.86rem",
            }}
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 && <p className="admin-empty">No products yet.</p>}
        {filtered.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Featured</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.images?.[0] ? (
                      <img className="admin-table__thumb" src={product.images[0].url} alt="" />
                    ) : (
                      <div className="admin-table__thumb" />
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td style={{ color: "var(--ivory-dim)" }}>{product.category?.name}</td>
                  <td style={{ color: "var(--gold-soft)" }}>{formatPrice(product)}</td>
                  <td>{product.featured ? "Yes" : "—"}</td>
                  <td>
                    <div className="admin-table__actions">
                      <Link className="admin-btn admin-btn--ghost" to={`/admin/products/${product.id}`}>
                        Edit
                      </Link>
                      <button
                        className="admin-btn admin-btn--danger"
                        disabled={busyId === product.id}
                        onClick={() => handleDelete(product)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </DataGate>
    </div>
  );
}
