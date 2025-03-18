import React from 'react';
import SEO from "../components/SEO";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-primary pt-24 pb-16">
      <SEO 
        title="PlatinumPath Pricing" 
        description="View our free and premium plans for tracking gaming achievements. Choose the best option for you."
      />
      
      <div className="max-w-4xl mx-auto container-padding">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Pricing</h1>
        <div className="glass-card rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-neutral-300 mb-8">
            Choose the plan that works best for you and your gaming journey.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/30 rounded-lg p-6 border border-neutral-800 hover:border-neon-purple transition-all">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <p className="text-2xl font-bold mb-4">$0<span className="text-sm text-neutral-400">/month</span></p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Basic profile customization</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Link one gaming account</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>View public leaderboards</span>
                </li>
              </ul>
              <button className="w-full py-2 bg-gradient-game rounded-md font-medium">
                Get Started
              </button>
            </div>
            
            <div className="bg-black/30 rounded-lg p-6 border border-neon-purple relative transform scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neon-purple text-black px-4 py-1 rounded-full text-sm font-bold">
                Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Pro Gamer</h3>
              <p className="text-2xl font-bold mb-4">$9.99<span className="text-sm text-neutral-400">/month</span></p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Full profile customization</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Link unlimited accounts</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Advanced achievement tracking</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Detailed gaming statistics</span>
                </li>
              </ul>
              <button className="w-full py-2 bg-gradient-game rounded-md font-medium">
                Choose Plan
              </button>
            </div>
            
            <div className="bg-black/30 rounded-lg p-6 border border-neutral-800 hover:border-neon-purple transition-all">
              <h3 className="text-xl font-bold mb-2">Ultimate</h3>
              <p className="text-2xl font-bold mb-4">$19.99<span className="text-sm text-neutral-400">/month</span></p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Everything in Pro Gamer</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Priority platform linking</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Early access to new features</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Exclusive trophy badges</span>
                </li>
              </ul>
              <button className="w-full py-2 bg-gradient-game rounded-md font-medium">
                Choose Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
