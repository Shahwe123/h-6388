
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Guides = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const guides = [
    {
      id: 1,
      title: "Getting Started with PlatinumPath",
      category: "Beginners",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Learn how to set up your PlatinumPath account and start tracking your gaming achievements."
    },
    {
      id: 2,
      title: "Linking Your Gaming Accounts",
      category: "Account Management",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Step-by-step guide to connecting your PlayStation, Xbox, and Steam accounts to PlatinumPath."
    },
    {
      id: 3,
      title: "Achievement Tracking Basics",
      category: "Features",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Understand how to view, filter, and sort your achievements across different gaming platforms."
    },
    {
      id: 4,
      title: "Competing with Friends",
      category: "Social",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Learn how to add friends, compare achievements, and participate in friendly competitions."
    },
    {
      id: 5,
      title: "Understanding Achievement Rarity",
      category: "Advanced",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Deep dive into achievement rarity, percentiles, and what makes certain trophies more valuable."
    },
    {
      id: 6,
      title: "Creating Your Profile Badge",
      category: "Customization",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Customize your profile badge to show off your greatest gaming accomplishments."
    },
    {
      id: 7,
      title: "Leaderboard Features Explained",
      category: "Features",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Everything you need to know about global and friends leaderboards on PlatinumPath."
    },
    {
      id: 8,
      title: "Troubleshooting Account Linking Issues",
      category: "Support",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1559336197-ded8aaa244bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Common problems when linking gaming accounts and how to solve them."
    }
  ];
  
  const filteredGuides = guides.filter(guide => 
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const categories = ["All", "Beginners", "Account Management", "Features", "Social", "Advanced", "Customization", "Support"];
  
  return (
    <div className="min-h-screen bg-primary pt-24 pb-16">
      <div className="max-w-6xl mx-auto container-padding">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Guides & Tutorials</h1>
          <p className="text-neutral-400">Learn how to make the most of your PlatinumPath experience</p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            <Input
              type="text"
              placeholder="Search guides..."
              className="pl-10 bg-black/30 border-neutral-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-md text-sm ${
                  category.toLowerCase() === searchQuery.toLowerCase() || (category === "All" && searchQuery === "")
                    ? "bg-neon-purple text-white"
                    : "bg-black/30 text-neutral-400 hover:bg-black/50"
                }`}
                onClick={() => setSearchQuery(category === "All" ? "" : category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredGuides.map(guide => (
            <div key={guide.id} className="glass-card rounded-xl overflow-hidden transition-transform hover:scale-[1.02]">
              <div className="h-40 overflow-hidden">
                <img src={guide.image} alt={guide.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs bg-neon-purple/20 text-neon-purple px-2 py-1 rounded">
                    {guide.category}
                  </span>
                  <span className="text-neutral-500 text-sm">{guide.readTime}</span>
                </div>
                <h2 className="text-xl font-bold mb-2">{guide.title}</h2>
                <p className="text-neutral-400 mb-4 text-sm">{guide.description}</p>
                <button className="text-neon-purple hover:text-neon-blue transition-colors text-sm font-medium">
                  Read Guide →
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-400 text-lg">No guides found matching "{searchQuery}"</p>
            <button 
              className="mt-4 text-neon-purple hover:text-neon-blue transition-colors"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guides;
