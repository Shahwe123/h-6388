
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import CreateThreadForm from '@/components/forum/CreateThreadForm';
import { ForumTagType } from '@/types/forum';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';

const CreateThread: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = (data: {
    title: string;
    content: string;
    tags: ForumTagType[];
    attachments: string[];
    gameName?: string;
  }) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      toast({
        title: "Thread created",
        description: "Your thread has been posted successfully",
        variant: "default"
      });
      
      // Navigate to forum (in a real app, would navigate to the new thread)
      navigate('/forum');
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-primary pb-16">
      <SEO 
        title="Create New Thread"
        description="Start a new discussion in our community forum"
      />
      
      <div className="max-w-4xl mx-auto container-padding">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/forum')}
        >
          <ChevronLeft size={18} className="mr-1" />
          Back to Forum
        </Button>
        
        <CreateThreadForm 
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CreateThread;
