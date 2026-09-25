import { useEffect, useRef, useState } from "react";
import { getSettings, updateSettings, uploadHeroImage } from "../lib/api";
import { Loading } from "../components/DataState";

const FIELDS = [
  { key: "phone_display", label: "Phone (displayed)", placeholder: "+92 300 000 0000" },
  { key: "phone_href", label: "Phone (link, e.g. tel:+923000000000)", placeholder: "tel:+923000000000" },
  { key: "whatsapp_number", label: "WhatsApp number (digits only, country code first)", placeholder: "923000000000" },
  { key: "email", label: "Email", placeholder: "hello@theqcollection.com" },
  { key: "address_line1", label: "Address line 1", placeholder: "Showroom by appointment" },
  { key: "address_line2", label: "Address line 2", placeholder: "City, Country" },
  { key: "hours_line1", label: "Hours line 1", placeholder: "Mon – Sat: 11:00 AM – 8:00 PM" },
  { key: "hours_line2", label: "Hours line 2", placeholder: "Sunday: By appointment" },
];

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const update = (field) => (e) => {
    setSettings((s) => ({ ...s, [field]: e.target.value }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const patch = Object.fromEntries(FIELDS.map((f) => [f.key, settings[f.key]]));
      await updateSettings(patch);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleHeroUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadHeroImage(file, settings.hero_image_path);
      setSettings((s) => ({ ...s, hero_image_url: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) return <Loading label="Loading settings…" />;
  if (!settings) return null;

  return (
    <div>
      <div className="admin-page__head">
        <div>
          <h1>Site Settings</h1>
          <p>The homepage hero photo and the contact details shown across the site.</p>
        </div>
      </div>

      <div style={{ marginBottom: "48px" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 500, marginBottom: "16px" }}>
          Homepage hero photo
        </h3>
        <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: "220px", aspectRatio: "16/9", border: "1px solid var(--line-soft)", overflow: "hidden", background: "var(--green-900)" }}>
            {settings.hero_image_url && (
              <img src={settings.hero_image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </div>
          <label className="admin-btn admin-btn--ghost" style={{ cursor: "pointer" }}>
            {uploading ? "Uploading…" : "Replace photo"}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleHeroUpload} disabled={uploading} style={{ display: "none" }} />
          </label>
        </div>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        {error && <div className="admin-error">{error}</div>}
        {saved && <div className="admin-note" style={{ color: "var(--gold-soft)" }}>Saved.</div>}

        {FIELDS.map((f) => (
          <div className="admin-field" key={f.key}>
            <label htmlFor={f.key}>{f.label}</label>
            <input id={f.key} placeholder={f.placeholder} value={settings[f.key] || ""} onChange={update(f.key)} />
          </div>
        ))}

        <div className="admin-form__actions">
          <button className="admin-btn" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
