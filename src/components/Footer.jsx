import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories, getSettings } from "../lib/api";
import logo from "../assets/logo.png";
import "./Footer.css";

export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
    getSettings().then(setSettings).catch(() => setSettings(null));
  }, []);

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src={logo} alt="" className="footer__logo" />
          <p>
            The Q Collection
            <br />
            Furniture, made to be lived with.
          </p>
          <div className="footer__social">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              Instagram
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              Facebook
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest">
              Pinterest
            </a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Navigate</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Categories</h4>
          <ul>
            {categories.map((category) => (
              <li key={category.slug}>
                <Link to={`/collections/${category.slug}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {settings && (
          <div className="footer__col">
            <h4>Visit</h4>
            <ul className="footer__contact">
              <li>{settings.address_line1}</li>
              <li>{settings.address_line2}</li>
              <li><a href={settings.phone_href}>{settings.phone_display}</a></li>
              <li><a href={`mailto:${settings.email}`}>{settings.email}</a></li>
            </ul>
          </div>
        )}
      </div>

      <div className="container footer__bottom">
        <span>&copy; 2026 The Q Collection. All Rights Reserved.</span>
        <span>All pieces made to order.</span>
      </div>
    </footer>
  );
}
