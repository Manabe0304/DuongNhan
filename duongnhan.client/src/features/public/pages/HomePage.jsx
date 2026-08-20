import HeroSection from "../sections/HeroSection";
import FeaturesSection from "../sections/FeaturesSection";
import HowItWorksSection from "../sections/HowItWorksSection";
import AboutSection from "../sections/AboutSection";
import FAQSection from "../sections/FAQSection";
import PricingPreview from "../sections/PricingPreview";
import CTABanner from "../sections/CTABanner";

/**
 * HomePage — Route: "/"
 * Scroll-based landing page. AboutPage & FAQPage are NOT separate routes;
 * they are merged in here as <AboutSection/> and <FAQSection/> per roadmap 2.2.
 */
export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AboutSection />
      <FAQSection />
      <PricingPreview />
      <CTABanner />
    </div>
  );
}
