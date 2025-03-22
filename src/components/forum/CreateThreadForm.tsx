
import React, { useState } from 'react';
import { ForumTagType, ForumCategory } from '@/types/forum';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Paperclip, X, AlertCircle, Loader2 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CreateThreadFormProps {
  onSubmit: (data: {
    title: string;
    content: string;
    tags: ForumTagType[];
    attachments: string[];
    gameName?: string;
    categoryId: string;
  }) => void;
  loading?: boolean;
  categories: ForumCategory[];
  isLoadingCategories?: boolean;
}

const CreateThreadForm: React.FC<CreateThreadFormProps> = ({ 
  onSubmit, 
  loading = false,
  categories = [],
  isLoadingCategories = false
}) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<ForumTagType[]>([]);
  const [gameName, setGameName] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [previewContent, setPreviewContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  
  const availableTags: ForumTagType[] = ['Guide', 'Help', 'Discussion', 'Challenge', 'Flex'];
  
  const handleTagToggle = (tag: ForumTagType) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const handlePreview = () => {
    setPreviewContent(content);
  };
  
  const handleAttachmentUpload = () => {
    // In a real implementation, this would handle file uploads to Cloudinary
    // For now, we'll just add a placeholder image
    const newAttachment = 'https://placehold.co/600x400/png';
    setAttachments([...attachments, newAttachment]);
    
    toast({
      title: "Image uploaded",
      description: "Your image has been attached to the thread",
    });
  };
  
  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your thread",
        variant: "destructive"
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter content for your thread",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedTags.length === 0) {
      toast({
        title: "Tag required",
        description: "Please select at least one tag for your thread",
        variant: "destructive"
      });
      return;
    }
    
    if (!categoryId) {
      toast({
        title: "Category required",
        description: "Please select a category for your thread",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit({
      title,
      content,
      tags: selectedTags,
      attachments,
      gameName: gameName.trim() || undefined,
      categoryId
    });
  };
  
  return (
    <div className="glass-card rounded-lg p-6">
      <h2 className="text-xl font-bold mb-6">Create New Thread</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Thread Title</Label>
            <Input
              id="title"
              placeholder="Enter a descriptive title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={categoryId} 
              onValueChange={setCategoryId}
              disabled={isLoadingCategories || categories.length === 0}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingCategories ? (
                  <SelectItem value="loading" disabled>
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading categories...
                    </span>
                  </SelectItem>
                ) : categories.length === 0 ? (
                  <SelectItem value="none" disabled>No categories available</SelectItem>
                ) : (
                  categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="game">Game (Optional)</Label>
            <Input
              id="game"
              placeholder="Enter game name if relevant"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Tags (Select at least one)</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {availableTags.map(tag => (
                <Button
                  key={tag}
                  type="button"
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  onClick={() => handleTagToggle(tag)}
                  className="h-auto py-1 px-3"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <Tabs defaultValue="write">
              <div className="flex justify-between items-center">
                <Label>Content</Label>
                <TabsList>
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger 
                    value="preview" 
                    onClick={handlePreview}
                    disabled={!content.trim()}
                  >
                    Preview
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="write" className="mt-1">
                <Textarea
                  placeholder="Write your thread content here..."
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </TabsContent>
              
              <TabsContent value="preview" className="mt-1">
                <div className="prose prose-invert max-w-none min-h-[200px] p-4 rounded-md border border-input bg-background">
                  {previewContent ? (
                    <p>{previewContent}</p>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <AlertCircle className="mr-2" size={18} />
                      Nothing to preview
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Label>Attachments</Label>
            <div className="mt-1">
              <Button
                type="button"
                variant="outline"
                onClick={handleAttachmentUpload}
                className="mb-2"
              >
                <Paperclip className="mr-2" size={16} />
                Attach Image
              </Button>
              
              {attachments.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={attachment}
                        alt={`Attachment ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : 'Create Thread'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateThreadForm;
