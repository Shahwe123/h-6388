
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, HelpCircle, MessageSquare, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import SEO from "../components/SEO";

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Support request sent",
        description: "We've received your message and will respond shortly.",
      });
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  // FAQ data
  const faqs = [
    {
      question: "How do I link my gaming accounts?",
      answer: "Go to Settings > Linked Accounts and follow the instructions for each platform (PlayStation, Xbox, Steam). You'll need to sign in to each platform's service to authorize the connection."
    },
    {
      question: "Why aren't my achievements syncing?",
      answer: "Achievements typically sync within 24 hours. If they're still not appearing after that time, try manually refreshing your profile. If issues persist, check that your gaming accounts are properly linked and that your privacy settings allow achievement tracking."
    },
    {
      question: "How do I add friends on PlatinumPath?",
      answer: "Go to the Friends tab and use the search bar to find friends by username. Click the Add Friend button to send a friend request. Once they accept, you'll be able to compare achievements and see each other's gaming activity."
    },
    {
      question: "What platforms are supported?",
      answer: "PlatinumPath currently supports PlayStation Network, Xbox Live, and Steam. We're working on adding support for more platforms in the future."
    },
    {
      question: "Is my gaming data secure?",
      answer: "Yes, we take security seriously. We only access the achievement and game data needed to provide our services, and we never store your gaming platform passwords. You can review our Privacy Policy for more details on how we protect your data."
    },
    {
      question: "How do I delete my account?",
      answer: "Go to Settings > Account > Delete Account. Please note that this action is permanent and will remove all your data from PlatinumPath."
    }
  ];

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-primary pt-24 pb-16">
      <SEO 
        title="Get Support" 
        description="Need help? Visit our support page for FAQs, troubleshooting, and customer support."
        url="/support"
      />
      <div className="max-w-4xl mx-auto container-padding">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Support Center</h1>
        
        <div className="glass-card rounded-xl p-8 mb-8">
          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>FAQs</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Contact</span>
              </TabsTrigger>
              <TabsTrigger value="guides" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Guides</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="faq" className="space-y-4">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                <Input
                  type="text"
                  placeholder="Search FAQs..."
                  className="pl-10 bg-black/30 border-neutral-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {filteredFaqs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <div key={index} className="bg-black/30 rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                      <p className="text-neutral-300">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-neutral-400">No FAQs found matching "{searchQuery}"</p>
                  <button 
                    className="mt-2 text-neon-purple hover:text-neon-blue transition-colors"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Contact Support</h2>
              <p className="text-neutral-300 mb-4">
                Having trouble? Fill out the form below and our support team will get back to you as soon as possible.
              </p>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    placeholder="John Doe"
                    required
                    className="bg-black/30 border-neutral-700"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium">
                    Your Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    placeholder="john@example.com"
                    required
                    className="bg-black/30 border-neutral-700"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block mb-2 text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    placeholder="What do you need help with?"
                    required
                    className="bg-black/30 border-neutral-700"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    placeholder="Please describe your issue in detail"
                    required
                    className="min-h-[120px] bg-black/30 border-neutral-700"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-game"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                      Sending...
                    </>
                  ) : 'Submit Support Request'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="guides" className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Support Guides</h2>
              <p className="text-neutral-300 mb-6">
                Check out our helpful guides to get the most out of PlatinumPath.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="/guides" className="bg-black/30 p-4 rounded-lg hover:bg-black/40 transition-colors block">
                  <h3 className="font-bold mb-2">Getting Started Guide</h3>
                  <p className="text-neutral-400 text-sm">Learn the basics of setting up your PlatinumPath account.</p>
                </a>
                
                <a href="/guides" className="bg-black/30 p-4 rounded-lg hover:bg-black/40 transition-colors block">
                  <h3 className="font-bold mb-2">Account Linking Tutorial</h3>
                  <p className="text-neutral-400 text-sm">Step-by-step instructions for connecting gaming platforms.</p>
                </a>
                
                <a href="/guides" className="bg-black/30 p-4 rounded-lg hover:bg-black/40 transition-colors block">
                  <h3 className="font-bold mb-2">Achievement Tracking Guide</h3>
                  <p className="text-neutral-400 text-sm">How to view, sort, and filter your achievements.</p>
                </a>
                
                <a href="/guides" className="bg-black/30 p-4 rounded-lg hover:bg-black/40 transition-colors block">
                  <h3 className="font-bold mb-2">Troubleshooting Common Issues</h3>
                  <p className="text-neutral-400 text-sm">Solutions for frequent problems and questions.</p>
                </a>
              </div>
              
              <div className="text-center mt-6">
                <Button asChild className="bg-gradient-game">
                  <a href="/guides">View All Guides</a>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Support;
