
import BetaLanding from "./BetaLanding";
import SEO from "../components/SEO";

/**
 * Index/Home page component
 * 
 * This is the main landing page of the application.
 * It now shows the Beta Landing page to showcase the app's upcoming features
 * and collect early access signups.
 * 
 * @returns {JSX.Element} The Index page UI
 */
const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO 
        title="PlatinumPath Beta - Game Achievement Tracker" 
        description="Join the PlatinumPath beta! Track all your gaming trophies across PlayStation, Xbox, and Steam in one place."
      />
      <BetaLanding />
    </div>
  );
};

export default Index;
