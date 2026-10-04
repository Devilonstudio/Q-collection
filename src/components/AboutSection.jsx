import Button from "./Button";
import RingMark from "./RingMark";
import "./AboutSection.css";
import Jameel from "../assets/Jameel.png";

const FULL_TEXT = [
  "Founded in 1992, The Q Collection began with vision to combine quality craftsmanship, premium materials and timeless design.",
  "Over years, we evolved from furniture business into complete furniture manufacturing and interior solutions brand in Balochistan, introducing customized furniture and tailored interior settings to meet unique requirements of every client.",
  "Today, The Q Collection brings design, manufacturing, customization and interior execution under one roof—delivering refined furniture and spaces defined by quality, functionality and individuality.",
  "Understand → Design → Craft → Refine → Deliver.",
];

export default function AboutSection({ variant = "excerpt" }) {
  const isFull = variant === "full";

  return (
    <section className="section about">
      <div className="container about__grid">
        <div className="about__media">
          <div className="about__media-frame">
            <img src={Jameel} alt="" />
          </div>
        </div>
        <div className="about__copy">
          <span className="eyebrow">Message from CEO</span>
          <h2 className="ceo-message">There is beauty in the details that make an object live longer</h2>
          {(isFull ? FULL_TEXT : FULL_TEXT.slice(0, 1)).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          {!isFull && (
            <Button to="/about" variant="ghost" size="small">
              Read our story
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
