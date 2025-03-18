
import React from 'react';
import { Link } from 'react-router-dom';
import SEO from "../components/SEO";

const Blog = () => {
  // Mock blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "How to Maximize Your Achievement Hunting Efficiency",
      excerpt: "Learn the best strategies for earning trophies and achievements faster without burnout.",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "May 15, 2024",
      author: "Alex Winters",
      category: "Tips & Tricks"
    },
    {
      id: 2,
      title: "The Psychology Behind Achievement Hunting",
      excerpt: "Exploring why we're driven to collect virtual trophies and what it says about human motivation.",
      image: "https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "May 8, 2024",
      author: "Dr. Sarah Chen",
      category: "Psychology"
    },
    {
      id: 3,
      title: "Top 10 Hardest Platinum Trophies in 2024",
      excerpt: "These games will push your skills to the limit. Are you up for the ultimate challenge?",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "April 30, 2024",
      author: "Marcus Johnson",
      category: "Lists"
    },
    {
      id: 4,
      title: "Interview: Meet the Player with Over 1000 Platinum Trophies",
      excerpt: "We sat down with the legendary achievement hunter to learn about their incredible journey.",
      image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      date: "April 22, 2024",
      author: "Jessica Wu",
      category: "Interviews"
    },
    {
      id: 5,
      title: "The Rise of Achievement Hunting Communities",
      excerpt: "How online communities have transformed achievement hunting into a social experience.",
      image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "April 15, 2024",
      author: "Alex Winters",
      category: "Community"
    },
    {
      id: 6,
      title: "Hidden Achievements: Finding the Secrets Developers Don't Want You to See",
      excerpt: "Uncovering the most obscure and challenging hidden achievements in popular games.",
      image: "https://images.unsplash.com/photo-1605979257913-1704eb7b6246?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "April 8, 2024",
      author: "Marcus Johnson",
      category: "Tips & Tricks"
    }
  ];

  return (
    <div className="min-h-screen bg-primary pt-24 pb-16">
      <SEO 
        title="Gaming Achievement Blog" 
        description="Read the latest guides, tips, and news on gaming achievements, trophies, and leaderboards."
        url="/blog"
      />
      <div className="max-w-6xl mx-auto container-padding">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">PlatinumPath Blog</h1>
            <p className="text-neutral-400">Latest news, guides, and insights for achievement hunters</p>
          </div>
          <div className="mt-4 md:mt-0">
            <select className="bg-black/30 border border-neutral-700 rounded-md px-4 py-2 text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neon-purple">
              <option value="all">All Categories</option>
              <option value="tips">Tips & Tricks</option>
              <option value="lists">Lists</option>
              <option value="psychology">Psychology</option>
              <option value="interviews">Interviews</option>
              <option value="community">Community</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogPosts.map(post => (
            <div key={post.id} className="glass-card rounded-xl overflow-hidden transition-transform hover:scale-[1.02]">
              <div className="h-48 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs bg-neon-purple/20 text-neon-purple px-2 py-1 rounded">
                    {post.category}
                  </span>
                  <span className="text-neutral-500 text-sm">{post.date}</span>
                </div>
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <p className="text-neutral-400 mb-4 text-sm">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">By {post.author}</span>
                  <Link to={`/blog/${post.id}`} className="text-neon-purple hover:text-neon-blue transition-colors text-sm font-medium">
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <button className="bg-gradient-game px-6 py-3 rounded-md font-medium">
            Load More Articles
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
