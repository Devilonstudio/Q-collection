import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProduct,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
  reorderProductImages,
} from "../lib/api";
import { Loading } from "../components/DataState";

const EMPTY = { name: "", category_id: "", price: "", description: "", featured: false };

export default function ProductForm() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCategories().then(setCategories).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (isNew) return;
    getProduct(id)
      .then((data) => {
        if (!data) throw new Error("Product not found");
        setForm({
          name: data.name,
          category_id: data.category_id,
          price: data.price ?? "",
          description: data.description,
          featured: data.featured,
        });
        setImages(data.images || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const update = (field) => (e) => {
    const value = field === "featured" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const buildPatch = () => ({
    name: form.name,
    category_id: form.category_id,
    price: form.price === "" ? null : Number(form.price),
    description: form.description,
    featured: form.featured,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        const created = await createProduct({ ...buildPatch(), sort_order: 0 });
        navigate(`/admin/products/${created.id}`, { replace: true });
      } else {
        await updateProduct(id, buildPatch());
        navigate("/admin/products");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${form.name}"? This can't be undone.`)) return;
    setSaving(true);
    try {
      await deleteProduct(id);
      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || isNew) return;
    setUploading(true);
    try {
      let order = images.length;
      for (const file of files) {
        const img = await uploadProductImage(id, file, order++);
        setImages((prev) => [...prev, img]);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = async (image) => {
    if (!window.confirm("Remove this image?")) return;
    try {
      await deleteProductImage(image);
      setImages((prev) => prev.filter((i) => i.id !== image.id));
    } catch (err) {
      alert(err.message);
    }
  };

  const moveImage = async (image, direction) => {
    const index = images.findIndex((i) => i.id === image.id);
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
    try {
      await reorderProductImages(next);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loading label="Loading product…" />;

  return (
    <div>
      <div className="admin-page__head">
        <div>
          <h1>{isNew ? "New Product" : `Edit ${form.name}`}</h1>
        </div>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        {error && <div className="admin-error">{error}</div>}

        <div className="admin-field">
          <label htmlFor="name">Name</label>
          <input id="name" required value={form.name} onChange={update("name")} />
        </div>

        <div className="admin-field">
          <label htmlFor="category">Category</label>
          <select id="category" required value={form.category_id} onChange={update("category_id")}>
            <option value="" disabled>Choose a category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="admin-field">
          <label htmlFor="price">Price</label>
          <input id="price" type="number" min="0" placeholder="Leave blank for “Enquire for Price”" value={form.price} onChange={update("price")} />
        </div>

        <div className="admin-field">
          <label htmlFor="description">Description</label>
          <textarea id="description" rows={4} value={form.description} onChange={update("description")} />
        </div>

        <div className="admin-field admin-field--row">
          <input id="featured" type="checkbox" checked={form.featured} onChange={update("featured")} style={{ width: "auto" }} />
          <label htmlFor="featured">Show in the homepage Featured Collection</label>
        </div>

        <div className="admin-form__actions">
          <button className="admin-btn" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save Product"}
          </button>
          {!isNew && (
            <button type="button" className="admin-btn admin-btn--danger" disabled={saving} onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </form>

      <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1px solid var(--line-soft)" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 500, marginBottom: "6px" }}>
          Images
        </h3>
        {isNew ? (
          <p className="admin-note">Save the product first, then come back here to add photos.</p>
        ) : (
          <>
            <p className="admin-note" style={{ marginBottom: "16px" }}>
              The first image is used as the cover photo everywhere on the site. Use the arrows to reorder.
            </p>
            <div className="image-manager">
              {images.map((image, i) => (
                <div className="image-manager__item" key={image.id}>
                  <img src={image.url} alt="" />
                  <div className="image-manager__item-actions">
                    <button type="button" disabled={i === 0} onClick={() => moveImage(image, -1)}>&larr;</button>
                    <button type="button" onClick={() => handleDeleteImage(image)}>Delete</button>
                    <button type="button" disabled={i === images.length - 1} onClick={() => moveImage(image, 1)}>&rarr;</button>
                  </div>
                </div>
              ))}
              <label className="image-manager__upload">
                {uploading ? "Uploading…" : "+ Add image(s)"}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
