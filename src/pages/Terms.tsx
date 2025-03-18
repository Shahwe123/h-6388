
import React from 'react';
import SEO from "../components/SEO";

const Terms = () => {
  return (
    <div className="min-h-screen bg-primary pt-24 pb-16">
      <SEO 
        title="Terms & Conditions" 
        description="Read the terms and conditions for using PlatinumPath's game achievement tracking services."
      />
      <div className="max-w-4xl mx-auto container-padding">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms of Service</h1>
        
        <div className="glass-card rounded-xl p-8">
          <p className="text-neutral-300 mb-6">
            Last updated: May 2024
          </p>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using PlatinumPath, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
              If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
            
            <h2>2. Description of Service</h2>
            <p>
              PlatinumPath is a platform that allows users to track gaming achievements across multiple platforms, 
              connect with friends, and participate in gaming communities. We integrate with various gaming platforms including 
              but not limited to PlayStation Network, Xbox Live, and Steam.
            </p>
            
            <h2>3. User Accounts</h2>
            <p>
              You must create an account to use certain features of PlatinumPath. You are responsible for maintaining the 
              confidentiality of your account information, including your password, and for all activity that occurs under your account. 
              You agree to notify us immediately of any unauthorized use of your account.
            </p>
            
            <h2>4. User Content</h2>
            <p>
              You may have the ability to post content on PlatinumPath, including profile information, comments, and other materials. 
              You retain all rights to any content you submit, post, or display on or through PlatinumPath.
            </p>
            <p>
              By posting content, you grant PlatinumPath a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, 
              adapt, publish, translate, distribute, and display such content in connection with providing the service.
            </p>
            
            <h2>5. Prohibited Uses</h2>
            <p>
              You agree not to use PlatinumPath:
            </p>
            <ul>
              <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
              <li>To impersonate or attempt to impersonate PlatinumPath, a PlatinumPath employee, another user, or any other person or entity</li>
              <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the service</li>
              <li>To attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the service</li>
              <li>To use the service for any commercial purposes without our prior written consent</li>
            </ul>
            
            <h2>6. Third-Party Services</h2>
            <p>
              PlatinumPath integrates with third-party services such as PlayStation Network, Xbox Live, and Steam. 
              Your use of these services through PlatinumPath is subject to the respective terms and conditions of these third-party services.
            </p>
            
            <h2>7. Limitation of Liability</h2>
            <p>
              In no event shall PlatinumPath, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including but not limited to, loss of profits, data, or use, 
              resulting from your access to or use of the service.
            </p>
            
            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will provide notice of any material changes by posting the new terms 
              on the site and updating the "Last updated" date. Your continued use of the site after such modifications will constitute 
              your acknowledgment of the modified terms and agreement to abide and be bound by the modified terms.
            </p>
            
            <h2>9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of California, 
              without regard to its conflict of law provisions.
            </p>
            
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              Email: legal@platinumpath.com<br />
              Address: 123 Gaming Street, San Francisco, CA 94102, USA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
