import Seo from "../components/Seo";
import Button from "../components/Button";
import RingMark from "../components/RingMark";
import "./NotFound.css";

export default function NotFound() {
  return (
    <section className="not-found">
      <Seo title="Page not found" description="The page you're looking for doesn't exist." />
      <RingMark size={80} />
      <h1>This room isn't in the collection.</h1>
      <p>The page you're looking for doesn't exist, or has moved.</p>
      <Button to="/">Back to Home</Button>
    </section>
  );
}
