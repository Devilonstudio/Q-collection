import "./SectionTitle.css";

export default function SectionTitle({ eyebrow, title, align = "left", children }) {
  return (
    <div className={`section-title section-title--${align}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {children && <p className="section-title__body">{children}</p>}
    </div>
  );
}
