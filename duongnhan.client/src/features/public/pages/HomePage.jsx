import HeroSection from "../sections/HeroSection";
import FeaturesSection from "../sections/FeaturesSection";
import HowItWorksSection from "../sections/HowItWorksSection";
import AboutSection from "../sections/AboutSection";
import FAQSection from "../sections/FAQSection";
import PricingPreview from "../sections/PricingPreview";
import TestimonialSection from "../sections/TestimonialSection";
import CTABanner from "../sections/CTABanner";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AboutSection />
      <FAQSection />
      <PricingPreview />
      <TestimonialSection />
      <CTABanner />
    </div>
  );
}
