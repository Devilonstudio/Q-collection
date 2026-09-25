import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCategories } from "../lib/api";
import logo from "../assets/logo.png";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    setQuery("");
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  return (
    <header className={`nav ${scrolled ? "nav--solid" : ""}`}>
      <div className="container nav__row">
        <Link to="/" className="nav__brand" aria-label="The Q Collection, home">
          <img src={logo} alt="" className="nav__logo" />
          <span className="nav__brand-text">The Q Collection</span>
        </Link>

        <nav className="nav__links" onClick={() => setOpen(false)}>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <a href="/#categories">Categories</a>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="nav__actions">
          <button
            className="nav__icon-btn"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <SearchIcon />
          </button>

          <button
            className="nav__toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {searchOpen && (
        <form className="nav__search" onSubmit={submitSearch}>
          <div className="container nav__search-inner">
            <SearchIcon />
            <input
              ref={searchRef}
              type="search"
              placeholder="Search the collection…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="button" className="nav__search-close" onClick={() => setSearchOpen(false)}>
              Close
            </button>
          </div>
        </form>
      )}

      <div className={`nav__mobile ${open ? "nav__mobile--open" : ""}`}>
        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
        <Link to="/shop" onClick={() => setOpen(false)}>Shop</Link>
        <a href="/#categories" onClick={() => setOpen(false)}>Categories</a>
        <Link to="/about" onClick={() => setOpen(false)}>About</Link>
        <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
        <div className="nav__mobile-divider" />
        {categories.map((c) => (
          <Link key={c.slug} to={`/collections/${c.slug}`} onClick={() => setOpen(false)} className="nav__mobile-sub">
            {c.name}
          </Link>
        ))}
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
