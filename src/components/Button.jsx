import { Link } from "react-router-dom";

export default function Button({
  to,
  href,
  onClick,
  type = "button",
  variant = "solid", // "solid" | "ghost"
  size, // "small"
  full,
  children,
  className = "",
}) {
  const classes = [
    "btn",
    variant === "ghost" ? "btn--ghost" : "",
    size === "small" ? "btn--small" : "",
    full ? "btn--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  if (href) {
    const isAnchor = href.startsWith("#");
    return (
      <a
        href={href}
        className={classes}
        {...(!isAnchor && { target: "_blank", rel: "noreferrer" })}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
