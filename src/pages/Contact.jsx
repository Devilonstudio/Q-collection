import { useState } from "react";
import Seo from "../components/Seo";
import Button from "../components/Button";
import RingMark from "../components/RingMark";
import { DataGate } from "../components/DataState";
import { useAsync } from "../hooks/useAsync";
import { getSettings, whatsappLink } from "../lib/api";
import "./Contact.css";

export default function Contact() {
  const { data: settings, loading, error } = useAsync(getSettings, []);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const mailtoHref = settings
    ? `mailto:${settings.email}?subject=${encodeURIComponent(
        `Enquiry from ${form.name || "the website"}`
      )}&body=${encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`)}`
    : "#";

  return (
    <section className="contact">
      <Seo
        title="Contact"
        description="Get in touch with The Q Collection — enquire about a piece, visit the showroom, or reach us on WhatsApp."
      />

      <div className="container contact__head">
        <span className="eyebrow">Get in touch</span>
        <h1>Have a piece in mind?</h1>
        <p>
          Tell us the room, the size, the finish — we'll help you find or
          commission the right piece from the collection.
        </p>
      </div>

      <DataGate loading={loading} error={error} label="Loading contact details…">
        {settings && (
          <div className="container contact__grid">
            <div className="contact__details">
              <div className="contact__block">
                <RingMark size={30} />
                <h4>WhatsApp</h4>
                <a href={whatsappLink(settings)} target="_blank" rel="noreferrer" className="link-underline">
                  Message us directly
                </a>
              </div>
              <div className="contact__block">
                <h4>Phone</h4>
                <a href={settings.phone_href}>{settings.phone_display}</a>
              </div>
              <div className="contact__block">
                <h4>Email</h4>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </div>
              <div className="contact__block">
                <h4>Showroom</h4>
                <p>{settings.address_line1}</p>
                <p>{settings.address_line2}</p>
              </div>
              <div className="contact__block">
                <h4>Hours</h4>
                <p>{settings.hours_line1}</p>
                <p>{settings.hours_line2}</p>
              </div>
            </div>

            <form
              className="contact__form"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = mailtoHref;
              }}
            >
              <label>
                Name
                <input type="text" required value={form.name} onChange={update("name")} />
              </label>
              <label>
                Email
                <input type="email" required value={form.email} onChange={update("email")} />
              </label>
              <label>
                Message
                <textarea rows={5} required value={form.message} onChange={update("message")} />
              </label>
              <Button type="submit" full>
                Send Enquiry
              </Button>
              <p className="contact__form-note">
                Opens your email app with this message pre-filled — nothing is sent from here directly.
              </p>
            </form>
          </div>
        )}
      </DataGate>
    </section>
  );
}
