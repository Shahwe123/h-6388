
import React from 'react';
import { Search, HelpCircle, FileText, MessageCircle, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SEO from "../components/SEO";

const Support = () => {
  const faqs = [
    {
      question: "How do I link my gaming accounts?",
      answer: "You can link your gaming accounts by going to the 'Link Accounts' page from your profile settings. We support PlayStation, Xbox, and Steam accounts."
    },
    {
      question: "Why aren't my achievements showing up?",
      answer: "Achievement syncing may take up to 24 hours. If your achievements still don't appear after that time, try unlinking and relinking your account."
    },
    {
      question: "How do I add friends on PlatinumPath?",
      answer: "Visit the Friends page and use the search bar to find your friends by username. Click the 'Add Friend' button to send them a friend request."
    },
    {
      question: "Can I make my profile private?",
      answer: "Yes, you can adjust your privacy settings in your account settings. You can choose to make your profile completely private or just hide certain achievements."
    },
    {
      question: "How do I view my achievement progress?",
      answer: "Your achievement progress is displayed on your profile page. You can filter by game or platform to see specific achievements."
    }
  ];

  return (
    <div className="min-h-screen bg-primary pt-24 pb-16">
      <SEO 
        title="Get Support" 
        description="Need help? Visit our support page for FAQs, troubleshooting, and customer support."
      />
      <div className="max-w-4xl mx-auto container-padding">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Support Center</h1>
        
        <div className="glass-card rounded-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">How can we help you?</h2>
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
              <Input
                type="text"
                placeholder="Search for help..."
                className="pl-10 bg-black/30 border-neutral-700"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/30 p-6 rounded-lg text-center">
              <HelpCircle className="w-10 h-10 text-neon-purple mx-auto mb-3" />
              <h3 className="font-bold mb-2">FAQs</h3>
              <p className="text-neutral-400 text-sm mb-4">Find answers to commonly asked questions</p>
              <Button variant="link" className="text-neon-purple">Browse FAQs</Button>
            </div>
            
            <div className="bg-black/30 p-6 rounded-lg text-center">
              <FileText className="w-10 h-10 text-neon-blue mx-auto mb-3" />
              <h3 className="font-bold mb-2">Guides</h3>
              <p className="text-neutral-400 text-sm mb-4">Step-by-step instructions for common tasks</p>
              <Button variant="link" className="text-neon-blue">View Guides</Button>
            </div>
            
            <div className="bg-black/30 p-6 rounded-lg text-center">
              <MessageCircle className="w-10 h-10 text-neon-green mx-auto mb-3" />
              <h3 className="font-bold mb-2">Contact Us</h3>
              <p className="text-neutral-400 text-sm mb-4">Get in touch with our support team</p>
              <Button variant="link" className="text-neon-green">Get Help</Button>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-neutral-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          <div className="bg-black/20 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Still need help?</h3>
            <p className="text-neutral-300 mb-4">
              Our support team is available to assist you. Please reach out and we'll get back to you as soon as possible.
            </p>
            <Button className="bg-gradient-game">
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
