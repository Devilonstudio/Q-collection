// A quiet nod to the logo's concentric ring — the one recurring signature
// element used sparingly across the site, never as generic decoration.
export default function RingMark({ size = 64, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M87 38C87 17.6 68.3 3 47 3"
        stroke="var(--gold)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M13 62C13 82.4 31.7 97 53 97"
        stroke="var(--gold)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
