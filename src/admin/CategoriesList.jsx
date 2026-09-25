import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories, updateCategory, deleteCategory } from "../lib/api";
import { DataGate } from "../components/DataState";

export default function CategoriesList() {
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    getCategories()
      .then((data) => setCategories(data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete "${category.name}" and every product inside it? This can't be undone.`)) return;
    setBusyId(category.id);
    try {
      await deleteCategory(category.id);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const move = async (category, direction) => {
    const index = categories.findIndex((c) => c.id === category.id);
    const swapWith = categories[index + direction];
    if (!swapWith) return;
    setBusyId(category.id);
    try {
      await Promise.all([
        updateCategory(category.id, { sort_order: swapWith.sort_order }),
        updateCategory(swapWith.id, { sort_order: category.sort_order }),
      ]);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="admin-page__head">
        <div>
          <h1>Categories</h1>
          <p>The order below is the order they appear on the site.</p>
        </div>
        <Link className="admin-btn" to="/admin/categories/new">+ New Category</Link>
      </div>

      <DataGate loading={loading} error={error}>
        {categories && categories.length === 0 && <p className="admin-empty">No categories yet.</p>}
        {categories && categories.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Tagline</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, i) => (
                <tr key={category.id}>
                  <td>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button
                        className="admin-btn admin-btn--ghost"
                        disabled={i === 0 || busyId === category.id}
                        onClick={() => move(category, -1)}
                      >
                        ↑
                      </button>
                      <button
                        className="admin-btn admin-btn--ghost"
                        disabled={i === categories.length - 1 || busyId === category.id}
                        onClick={() => move(category, 1)}
                      >
                        ↓
                      </button>
                    </div>
                  </td>
                  <td>{category.name}</td>
                  <td style={{ color: "var(--ivory-faint)" }}>{category.slug}</td>
                  <td style={{ color: "var(--ivory-dim)" }}>{category.tagline}</td>
                  <td>
                    <div className="admin-table__actions">
                      <Link className="admin-btn admin-btn--ghost" to={`/admin/categories/${category.id}`}>
                        Edit
                      </Link>
                      <button
                        className="admin-btn admin-btn--danger"
                        disabled={busyId === category.id}
                        onClick={() => handleDelete(category)}
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
