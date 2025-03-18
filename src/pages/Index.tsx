
import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Stats from "../components/Stats";
import Testimonials from "../components/Testimonials";
import Blog from "../components/Blog";
import Footer from "../components/Footer";
import Problems from "../components/Problems";

/**
 * Index/Home page component
 * 
 * This is the main landing page of the application.
 * It showcases the app's features, benefits, and content to attract new users.
 * 
 * Components rendered:
 * - Header: Navigation and branding
 * - Hero: Main hero section with call-to-action
 * - Problems: Explaining problems the app solves
 * - Features: Highlighting key features
 * - Stats: Showing app statistics
 * - Testimonials: User testimonials
 * - Blog: Recent blog posts or updates
 * - Footer: Site footer
 * 
 * @returns {JSX.Element} The Index page UI
 */
const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Problems />
        <Features />
        <Stats />
        <Testimonials />
        <Blog />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
