
import React from 'react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-primary pt-24 pb-16">
      <div className="max-w-4xl mx-auto container-padding">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="glass-card rounded-xl p-8">
          <p className="text-neutral-300 mb-6">
            Last updated: May 2024
          </p>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Welcome to PlatinumPath. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our website 
              and tell you about your privacy rights and how the law protects you.
            </p>
            
            <h2>2. The Data We Collect About You</h2>
            <p>
              Personal data, or personal information, means any information about an individual from which that person can be identified. 
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul>
              <li><strong>Identity Data</strong> includes username, email address, and profile information.</li>
              <li><strong>Gaming Data</strong> includes your linked gaming accounts (PlayStation, Xbox, Steam), achievements, trophies, and game statistics.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, 
              browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
              <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
            </ul>
            
            <h2>3. How We Use Your Personal Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul>
              <li>To register you as a new user</li>
              <li>To provide and manage your account</li>
              <li>To connect your gaming accounts and sync your achievements</li>
              <li>To enable social features like friends, comparisons, and leaderboards</li>
              <li>To improve our website and services</li>
              <li>To notify you about changes to our service</li>
              <li>To provide customer support</li>
            </ul>
            
            <h2>4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, 
              or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, 
              agents, contractors, and other third parties who have a business need to know.
            </p>
            
            <h2>5. Data Retention</h2>
            <p>
              We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, 
              including for the purposes of satisfying any legal, accounting, or reporting requirements.
            </p>
            
            <h2>6. Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
            </p>
            <ul>
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
            
            <h2>7. Changes to the Privacy Policy</h2>
            <p>
              We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page 
              and updating the "Last updated" date at the top of this privacy policy.
            </p>
            
            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
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

export default Privacy;
