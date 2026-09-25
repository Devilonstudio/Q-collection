import Seo from "../components/Seo";
import Hero from "../components/Hero";
import CategoryGrid from "../components/CategoryGrid";
import FeaturedCollection from "../components/FeaturedCollection";
import AboutSection from "../components/AboutSection";
import WhyChooseUs from "../components/WhyChooseUs";
import ContactCta from "../components/ContactCta";

export default function Home() {
  return (
    <>
      <Seo
        title=""
        description="The Q Collection — luxury furniture in dark timber and worked brass. Bedroom, living room, dining and office pieces, made to order."
      />
      <Hero />
      <CategoryGrid />
      <FeaturedCollection />
      <AboutSection variant="excerpt" />
      <WhyChooseUs />
      <ContactCta />
    </>
  );
}
