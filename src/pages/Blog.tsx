
import React from 'react';
import { Link } from 'react-router-dom';
import SEO from "../components/SEO";

const Blog = () => {
  // Empty blog posts array
  const blogPosts = [];

  return (
    <div className="min-h-screen bg-primary pt-24 pb-16">
      <SEO 
        title="Gaming Achievement Blog" 
        description="Read the latest guides, tips, and news on gaming achievements, trophies, and leaderboards."
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
        
        {blogPosts.length > 0 ? (
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
        ) : (
          <div className="glass-card rounded-xl p-12 text-center mb-12">
            <h2 className="text-xl font-bold mb-4">No Articles Yet</h2>
            <p className="text-neutral-400 mb-6 max-w-md mx-auto">
              We're working on creating valuable content for achievement hunters. 
              Check back soon for guides, tips, and achievement hunting strategies!
            </p>
          </div>
        )}
        
        {blogPosts.length > 0 && (
          <div className="flex justify-center">
            <button className="bg-gradient-game px-6 py-3 rounded-md font-medium">
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
