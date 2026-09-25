import { useEffect } from "react";

const SITE_NAME = "The Q Collection";

function setMeta(name, content, attr = "name") {
  if (!content) return;
  let tag = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export default function Seo({ title, description, image }) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Luxury Furniture`;
    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, "property");
    }
    setMeta("og:title", document.title, "property");
    setMeta("og:type", "website", "property");
    if (image) setMeta("og:image", image, "property");
  }, [title, description, image]);

  return null;
}
