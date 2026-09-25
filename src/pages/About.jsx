import Seo from "../components/Seo";
import AboutSection from "../components/AboutSection";
import WhyChooseUs from "../components/WhyChooseUs";
import ContactCta from "../components/ContactCta";

export default function About() {
  return (
    <>
      <Seo
        title="About"
        description="The story behind The Q Collection — furniture made in small runs, by hand, from solid timber and worked brass."
      />
      <div style={{ paddingTop: "40px" }}>
        <AboutSection variant="full" />
        <WhyChooseUs />
        <ContactCta />
      </div>
    </>
  );
}
