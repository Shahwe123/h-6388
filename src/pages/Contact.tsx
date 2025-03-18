
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import SEO from "../components/SEO";

const Contact = () => {
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
        title: "Message sent!",
        description: "We've received your message and will respond soon.",
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

  return (
    <div className="min-h-screen bg-primary pt-24 pb-16">
      <SEO 
        title="Contact Us" 
        description="Get in touch with the PlatinumPath team for support, partnerships, or general inquiries."
        url="/contact"
      />
      <div className="max-w-4xl mx-auto container-padding">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Contact Us</h1>
        
        <div className="glass-card rounded-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="text-neutral-300 mb-8">
                Have questions or feedback? We'd love to hear from you. Fill out the form and our team will get back to you as soon as possible.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-neon-purple/20 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="text-neon-purple" />
                  </div>
                  <div>
                    <h3 className="font-bold">Email</h3>
                    <p className="text-neutral-400">contact@platinumpath.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-neon-blue/20 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="text-neon-blue" />
                  </div>
                  <div>
                    <h3 className="font-bold">Phone</h3>
                    <p className="text-neutral-400">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-neon-green/20 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="text-neon-green" />
                  </div>
                  <div>
                    <h3 className="font-bold">Location</h3>
                    <p className="text-neutral-400">San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
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
                    placeholder="How can we help you?"
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
                    placeholder="Your message here..."
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
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
