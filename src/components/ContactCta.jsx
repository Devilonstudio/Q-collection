import { useEffect, useState } from "react";
import Button from "./Button";
import RingMark from "./RingMark";
import { getSettings, whatsappLink } from "../lib/api";
import "./ContactCta.css";

export default function ContactCta() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings().then(setSettings).catch(() => setSettings(null));
  }, []);

  return (
    <section className="cta">
      <RingMark size={420} className="cta__ring" />
      <div className="container cta__inner">
        <h2>Have a piece in mind?</h2>
        <p>
          Tell us the room, the size, the finish — we'll help you find or
          commission the right piece from the collection.
        </p>
        <div className="cta__actions">
          <Button href={whatsappLink(settings)}>Enquire on WhatsApp</Button>
          <Button to="/contact" variant="ghost">
            All contact details
          </Button>
        </div>
      </div>
    </section>
  );
}
