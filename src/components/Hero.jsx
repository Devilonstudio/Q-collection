import { useEffect, useState } from "react";
import { getSettings } from "../lib/api";
import Button from "./Button";
import RingMark from "./RingMark";
import "./Hero.css";

export default function Hero() {
  const [heroImage, setHeroImage] = useState(null);

  useEffect(() => {
    getSettings()
      .then((s) => setHeroImage(s?.hero_image_url || null))
      .catch(() => setHeroImage(null));
  }, []);

  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true">
        {heroImage ? (
          <img src={heroImage} alt="" className="hero__bg-image" />
        ) : (
          <div className="hero__bg-placeholder" />
        )}
        <div className="hero__bg-overlay" />
      </div>

      <RingMark size={620} className="hero__ring" />

      <div className="container hero__content">
        <span className="eyebrow fade-up">The Q Collection</span>
        <h1 className="fade-up hero__headline" style={{ animationDelay: "0.08s" }}>
          Furniture that defines
          <br />
          <em>your space.</em>
        </h1>
        <p className="hero__sub fade-up" style={{ animationDelay: "0.16s" }}>
          Discover timeless furniture, crafted for sophisticated living — in
          dark timber and worked brass, made to hold its shape for decades.
        </p>
        <div className="fade-up" style={{ animationDelay: "0.24s" }}>
          <Button href="#categories">Explore Collection</Button>
        </div>
      </div>

      <a href="#categories" className="hero__scroll" aria-label="Scroll to categories">
        <span />
      </a>
    </section>
  );
}
