
import { useState, useRef } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Problems from "@/components/Problems";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";

const Index = () => {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const problemsRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    setIsNewsletterOpen(true);
  };

  const handleSeeTheSolutions = () => {
    if (problemsRef.current) {
      problemsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <Header />
      <Hero onGetStarted={handleGetStarted} onSeeTheSolutions={handleSeeTheSolutions} />
      <div ref={problemsRef}>
        <Problems />
      </div>
      <Features />
      <Stats />
      <Testimonials />
      <Blog />
      <Footer />
      <NewsletterForm isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)} />
    </div>
  );
};

export default Index;
