
import React from 'react';
import SEO from "../components/SEO";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-primary pt-24 pb-16">
      <SEO 
        title="Cookie Policy" 
        description="Learn about how PlatinumPath uses cookies to enhance your gaming experience."
      />
      <div className="max-w-4xl mx-auto container-padding">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Cookie Policy</h1>
        
        <div className="glass-card rounded-xl p-8">
          <p className="text-neutral-300 mb-6">
            Last updated: May 2024
          </p>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <h2>1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and provide information to the owners of the site.
            </p>
            
            <h2>2. How We Use Cookies</h2>
            <p>
              PlatinumPath uses cookies for several purposes, including:
            </p>
            <ul>
              <li><strong>Essential cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access.</li>
              <li><strong>Functionality cookies:</strong> These cookies help us to personalize content and remember your preferences (e.g., your choice of language or region).</li>
              <li><strong>Analytics cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.</li>
              <li><strong>Advertising cookies:</strong> These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites.</li>
            </ul>
            
            <h2>3. The Cookies We Set</h2>
            <p>
              We use the following cookies on our website:
            </p>
            <ul>
              <li><strong>Account-related cookies:</strong> If you create an account with us, we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out; however, in some cases, they may remain to remember your site preferences.</li>
              <li><strong>Login-related cookies:</strong> We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every time you visit a new page.</li>
              <li><strong>Site preferences cookies:</strong> To provide you with a great experience on this site, we provide the functionality to set your preferences for how this site runs when you use it.</li>
            </ul>
            
            <h2>4. Third-Party Cookies</h2>
            <p>
              In some special cases, we also use cookies provided by trusted third parties. The following section details which third-party cookies you might encounter through this site:
            </p>
            <ul>
              <li>This site uses Google Analytics, one of the most widespread and trusted analytics solutions on the web, to help us understand how you use the site and ways that we can improve your experience.</li>
              <li>We also use social media buttons and/or plugins on this site that allow you to connect with your social network in various ways. For these to work, social media sites will set cookies through our site which may be used to enhance your profile on their site or contribute to the data they hold for various purposes outlined in their respective privacy policies.</li>
            </ul>
            
            <h2>5. Managing Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, as it will no longer be personalized to you.
            </p>
            
            <h2>6. More Information</h2>
            <p>
              For more information about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.allaboutcookies.org" className="text-neon-purple">www.allaboutcookies.org</a>.
            </p>
            
            <h2>7. Changes to This Cookie Policy</h2>
            <p>
              We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date at the top of this Cookie Policy.
            </p>
            
            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact us at:
            </p>
            <p>
              Email: privacy@platinumpath.com<br />
              Address: 123 Gaming Street, San Francisco, CA 94102, USA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
