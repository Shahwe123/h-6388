
import { useState } from "react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import NewsletterForm from "@/components/NewsletterForm";
import SEO from "@/components/SEO";

// Import our new components
import HeroSection from "./components/HeroSection";
import ProblemSolutionSection from "./components/ProblemSolutionSection";
import BetaFeaturesSection from "./components/BetaFeaturesSection";
import BetaPerksSection from "./components/BetaPerksSection";
import HowItWorksSection from "./components/HowItWorksSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CountdownSection from "./components/CountdownSection";
import BetaFooter from "./components/BetaFooter";

const BetaLanding = () => {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const { toast } = useToast();

  const openNewsletterForm = () => {
    setIsNewsletterOpen(true);
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="Join PlatinumPath Game Achievement Tracker Beta" 
        description="Be among the first to try PlatinumPath Game Achievement Tracker! Sign up for early beta access to out trophy achievement Manager." 
      />
      <Header />
      <main>
        <HeroSection openNewsletterForm={openNewsletterForm} />
        <ProblemSolutionSection openNewsletterForm={openNewsletterForm} />
        <BetaFeaturesSection openNewsletterForm={openNewsletterForm} />
        <BetaPerksSection openNewsletterForm={openNewsletterForm} />
        <HowItWorksSection openNewsletterForm={openNewsletterForm} />
        <TestimonialsSection />
        <CountdownSection openNewsletterForm={openNewsletterForm} />
      </main>
      <BetaFooter />
      {isNewsletterOpen && (
        <NewsletterForm 
          isOpen={isNewsletterOpen} 
          onClose={() => setIsNewsletterOpen(false)} 
        />
      )}
    </div>
  );
};

export default BetaLanding;
