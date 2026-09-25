import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getCategories,
  slugify,
} from "../lib/api";
import { Loading } from "../components/DataState";

const EMPTY = { name: "", slug: "", tagline: "", description: "" };

export default function CategoryForm() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [slugTouched, setSlugTouched] = useState(!isNew);

  useEffect(() => {
    if (isNew) return;
    getCategoryById(id)
      .then((data) => {
        if (!data) throw new Error("Category not found");
        setForm(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const update = (field) => (e) => {
    const value = e.target.value;
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === "name" && !slugTouched) next.slug = slugify(value);
      return next;
    });
    if (field === "slug") setSlugTouched(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        const existing = await getCategories();
        const nextOrder = existing.length ? Math.max(...existing.map((c) => c.sort_order)) + 1 : 1;
        await createCategory({ ...form, sort_order: nextOrder });
      } else {
        await updateCategory(id, {
          name: form.name,
          slug: form.slug,
          tagline: form.tagline,
          description: form.description,
        });
      }
      navigate("/admin/categories");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${form.name}" and every product inside it? This can't be undone.`)) return;
    setSaving(true);
    try {
      await deleteCategory(id);
      navigate("/admin/categories");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) return <Loading label="Loading category…" />;

  return (
    <div>
      <div className="admin-page__head">
        <div>
          <h1>{isNew ? "New Category" : `Edit ${form.name}`}</h1>
        </div>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        {error && <div className="admin-error">{error}</div>}

        <div className="admin-field">
          <label htmlFor="name">Name</label>
          <input id="name" required value={form.name} onChange={update("name")} />
        </div>

        <div className="admin-field">
          <label htmlFor="slug">URL slug</label>
          <input id="slug" required value={form.slug} onChange={update("slug")} />
          <span className="admin-note">Appears in the URL as /collections/{form.slug || "…"}</span>
        </div>

        <div className="admin-field">
          <label htmlFor="tagline">Tagline</label>
          <input id="tagline" value={form.tagline} onChange={update("tagline")} />
          <span className="admin-note">Short line shown under the name on the homepage card.</span>
        </div>

        <div className="admin-field">
          <label htmlFor="description">Description</label>
          <textarea id="description" rows={4} value={form.description} onChange={update("description")} />
          <span className="admin-note">Longer text shown at the top of the category page.</span>
        </div>

        <div className="admin-form__actions">
          <button className="admin-btn" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save Category"}
          </button>
          {!isNew && (
            <button type="button" className="admin-btn admin-btn--danger" disabled={saving} onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
