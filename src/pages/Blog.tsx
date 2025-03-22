
import React from 'react';
import { Link } from 'react-router-dom';
import SEO from "../components/SEO";
import { Helmet } from 'react-helmet-async';

const Blog = () => {
  // Sample blog posts - we'll create a few to demonstrate structured data
  const blogPosts = [
    {
      id: 1,
      title: "Getting Started with Achievement Hunting",
      excerpt: "Learn how to begin your journey to 100% completion and platinum trophies.",
      author: "Trophy Hunter",
      date: "2023-07-15",
      category: "Guides",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      url: "/blog/getting-started-with-achievement-hunting"
    },
    {
      id: 2,
      title: "Top 10 Easiest Platinum Trophies",
      excerpt: "Looking for some quick wins? These games offer the easiest platinum trophies.",
      author: "Platinum Pro",
      date: "2023-08-22",
      category: "Lists",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      url: "/blog/top-10-easiest-platinum-trophies"
    },
    {
      id: 3,
      title: "The Psychology of Achievement Hunting",
      excerpt: "Why do we feel compelled to collect every trophy? The science behind achievement hunting.",
      author: "Dr. Gamer",
      date: "2023-09-10",
      category: "Psychology",
      image: "https://images.unsplash.com/photo-1551817958-d9d86fb29431?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      url: "/blog/psychology-of-achievement-hunting"
    }
  ];

  // Create structured data for the blog posts
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "headline": "PlatinumPath Blog",
    "description": "Latest news, guides, and insights for achievement hunters",
    "url": "https://platinumpath.net/blog",
    "publisher": {
      "@type": "Organization",
      "name": "PlatinumPath",
      "logo": {
        "@type": "ImageObject",
        "url": "https://platinumpath.net/logo.png"
      }
    },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "datePublished": post.date,
      "image": post.image,
      "url": `https://platinumpath.net${post.url}`
    }))
  };

  return (
    <div className="min-h-screen bg-primary pt-24 pb-16">
      <SEO 
        title="Gaming Achievement Blog" 
        description="Read the latest guides, tips, and news on gaming achievements, trophies, and leaderboards."
      />
      
      {/* Add structured data for better SEO */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
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
                    <Link to={post.url} className="text-neon-purple hover:text-neon-blue transition-colors text-sm font-medium">
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
