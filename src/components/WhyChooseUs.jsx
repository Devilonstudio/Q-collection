import SectionTitle from "./SectionTitle";
import "./WhyChooseUs.css";

const FEATURES = [
  {
    title: "Exceptional Craftsmanship",
    body: "Every piece is joined, finished and detailed by hand rather than assembled on a line.",
    icon: <ChiselIcon />,
  },
  {
    title: "Timeless Design",
    body: "Forms chosen to suit a room for decades, not a single season's trend cycle.",
    icon: <RingIcon />,
  },
  {
    title: "Premium Materials",
    body: "Solid hardwood and worked brass throughout — no veneer standing in for the real thing.",
    icon: <LeafIcon />,
  },
  {
    title: "Designed for Modern Living",
    body: "Scaled and finished for the way rooms are actually used today, not a showroom fantasy.",
    icon: <HomeIcon />,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section why">
      <div className="container">
        <SectionTitle eyebrow="Why The Q Collection" title="What sets each piece apart." align="center" />
        <div className="why__grid">
          {FEATURES.map((f) => (
            <div className="why__item" key={f.title}>
              <div className="why__icon">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChiselIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20L14 10M14 10L20 4M14 10L18 14M4 20L8 16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RingIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20C4 11 11 4 20 4C20 13 13 20 4 20Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M4 20L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 11L12 4L20 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 9.5V20H18V9.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}
