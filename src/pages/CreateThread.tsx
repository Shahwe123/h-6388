
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import CreateThreadForm from '@/components/forum/CreateThreadForm';
import { ForumTagType } from '@/types/forum';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';
import { useForumData } from '@/hooks/useForumData';
import { supabase } from '@/integrations/supabase/client';

const CreateThread: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { categoriesQuery, createThread, isCreatingThread } = useForumData();
  
  // Check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
      
      if (!data.session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to create a thread",
          variant: "destructive"
        });
        navigate('/forum');
      }
    };
    
    checkAuth();
  }, [navigate, toast]);
  
  const handleSubmit = (data: {
    title: string;
    content: string;
    tags: ForumTagType[];
    attachments: string[];
    gameName?: string;
    categoryId: string;
  }) => {
    createThread(data, {
      onSuccess: (thread) => {
        if (thread) {
          navigate(`/forum/thread/${thread.id}`);
        }
      }
    });
  };
  
  if (isLoggedIn === false) {
    return null; // Will redirect via useEffect
  }
  
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
          loading={isCreatingThread}
          categories={categoriesQuery.data || []}
          isLoadingCategories={categoriesQuery.isLoading}
        />
      </div>
    </div>
  );
};

export default CreateThread;
