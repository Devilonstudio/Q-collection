import Button from "./Button";
import RingMark from "./RingMark";
import "./AboutSection.css";

const FULL_TEXT = [
  "The Q Collection was built on a simple premise: furniture should be made to be lived with, not replaced. Every piece is designed in dark timber and worked brass, and finished by hand rather than rushed through a production line.",
  "We work in small runs rather than mass batches, which means more attention per piece — grain matched by eye, joints cut to last, and finishes worked until they hold the depth we're after. It also means a piece from the collection rarely looks identical to the last.",
  "Nothing here is designed to be fashionable for a season. It's designed to still make sense in a room a decade from now.",
];

export default function AboutSection({ variant = "excerpt" }) {
  const isFull = variant === "full";

  return (
    <section className="section about">
      <div className="container about__grid">
        <div className="about__media">
          <div className="about__media-frame">
            <RingMark size={64} />
          </div>
        </div>
        <div className="about__copy">
          <span className="eyebrow">About the collection</span>
          <h2>Furniture built to be lived with.</h2>
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
