
import React, { useState } from 'react';
import { Search, HelpCircle, FileText, MessageCircle, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Support ticket submitted!",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 1500);
  };
  
  // FAQs data
  const faqs = [
    {
      question: "How do I link my gaming accounts?",
      answer: "To link your gaming accounts, go to Settings > Linked Accounts and follow the instructions for each platform. You'll need to authorize PlatinumPath to access your achievement data.",
      category: "Account"
    },
    {
      question: "Why aren't my achievements syncing?",
      answer: "Achievement syncing can take up to 24 hours. If they're still not appearing, try manually refreshing your profile. If the issue persists, ensure your accounts are properly linked.",
      category: "Achievements"
    },
    {
      question: "Can I track achievements from other platforms?",
      answer: "Currently, PlatinumPath supports PlayStation, Xbox, and Steam. We're working on adding support for more platforms like Nintendo Switch, Epic Games Store, and GOG.",
      category: "Platforms"
    },
    {
      question: "How does the leaderboard scoring work?",
      answer: "Our leaderboard scoring system assigns points based on achievement rarity, completion percentage, and platform. Rare achievements and platinum trophies are weighted more heavily in the calculations.",
      category: "Leaderboards"
    },
    {
      question: "Is my gaming data private?",
      answer: "Your privacy is important to us. By default, your profile is visible to friends only. You can adjust your privacy settings to make your profile public or completely private.",
      category: "Privacy"
    },
    {
      question: "How do I reset my password?",
      answer: "To reset your password, click 'Forgot Password' on the login page. We'll send a password reset link to your registered email address.",
      category: "Account"
    },
    {
      question: "Can I delete specific achievements from my profile?",
      answer: "No, PlatinumPath syncs directly with gaming platforms and displays all achievements as they appear there. We cannot selectively hide or delete individual achievements.",
      category: "Achievements"
    },
    {
      question: "How often are achievements updated?",
      answer: "Achievements are automatically updated once every 24 hours. You can manually trigger an update by clicking the refresh button on your profile page.",
      category: "Achievements"
    }
  ];
  
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-primary pt-24 pb-16">
      <div className="max-w-6xl mx-auto container-padding">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Support Center</h1>
          <p className="text-neutral-400">Find answers to common questions or contact our support team</p>
        </div>
        
        <div className="glass-card rounded-xl p-6 mb-12">
          <div className="relative w-full max-w-xl mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            <Input
              type="text"
              placeholder="Search frequently asked questions..."
              className="pl-10 bg-black/30 border-neutral-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-black/30 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-neon-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="text-neon-purple" />
              </div>
              <h3 className="font-bold text-lg mb-2">Help Center</h3>
              <p className="text-neutral-400 mb-4">Explore our comprehensive knowledge base for detailed articles and guides.</p>
              <button className="text-neon-purple hover:text-neon-blue transition-colors text-sm font-medium">
                Browse Articles →
              </button>
            </div>
            
            <div className="bg-black/30 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-neon-blue" />
              </div>
              <h3 className="font-bold text-lg mb-2">Documentation</h3>
              <p className="text-neutral-400 mb-4">Check our detailed documentation for technical information and guides.</p>
              <button className="text-neon-blue hover:text-neon-purple transition-colors text-sm font-medium">
                View Documentation →
              </button>
            </div>
            
            <div className="bg-black/30 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-neon-green" />
              </div>
              <h3 className="font-bold text-lg mb-2">Community</h3>
              <p className="text-neutral-400 mb-4">Join our community forum to connect with other users and share experiences.</p>
              <button className="text-neon-green hover:text-neon-purple transition-colors text-sm font-medium">
                Join Discord →
              </button>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="bg-neon-purple/20 text-neon-purple px-2 py-1 text-xs rounded-md inline-block">
                      {faq.category}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-bold mb-2">{faq.question}</h3>
                      <p className="text-neutral-400">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-400">No FAQs found matching "{searchQuery}"</p>
              <button 
                className="mt-4 text-neon-purple hover:text-neon-blue transition-colors"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Contact Support</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-neutral-300 mb-4">
                Couldn't find what you're looking for? Our support team is here to help!
                Fill out the form and we'll get back to you as soon as possible.
              </p>
              
              <div className="bg-black/30 p-4 rounded-lg mb-6">
                <div className="flex items-center mb-2">
                  <Mail className="text-neon-purple mr-2 h-5 w-5" />
                  <h3 className="font-bold">Email Support</h3>
                </div>
                <p className="text-neutral-400">support@platinumpath.com</p>
              </div>
              
              <p className="text-sm text-neutral-500">
                Our support team is available Monday through Friday, 9AM-5PM PT.
                Typical response time is within 24 hours.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium">
                  Your Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
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
                  value={formData.email}
                  onChange={handleChange}
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
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="I need help with..."
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
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please describe your issue in detail..."
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
                    Submitting...
                  </>
                ) : (
                  "Submit Support Request"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
