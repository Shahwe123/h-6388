
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from "../components/SEO";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Real blog post data
  const blogPosts = [
    {
      id: 1,
      title: "🏆 Why We Built PlatinumPath: A Better Way to Track Game Achievements",
      excerpt: "PlatinumPath is the next-generation game achievement tracker that enhances how you track PlayStation, Xbox, and Steam trophies. Find out how we improve on existing trackers.",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "June 5, 2024",
      author: "PlatinumPath Team",
      category: "Product"
    }
  ];

  // Calculate page counts
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Handle page changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
              <option value="product">Product</option>
              <option value="tips">Tips & Tricks</option>
              <option value="lists">Lists</option>
              <option value="guides">Guides</option>
              <option value="community">Community</option>
            </select>
          </div>
        </div>
        
        {blogPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {currentPosts.map(post => (
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

            {totalPages > 1 && (
              <Pagination className="my-8">
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious onClick={() => paginate(currentPage - 1)} />
                    </PaginationItem>
                  )}
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        isActive={currentPage === i + 1} 
                        onClick={() => paginate(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext onClick={() => paginate(currentPage + 1)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-2">No blog posts yet</h2>
            <p className="text-neutral-400 mb-4">Check back soon for exciting content!</p>
          </div>
        )}

        <div className="glass-card p-8 rounded-xl mt-12">
          <h2 className="text-2xl font-bold mb-4">Subscribe to our Newsletter</h2>
          <p className="text-neutral-400 mb-6">Stay updated with our latest guides, tips, and trophy hunting strategies</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-black/30 border border-neutral-700 rounded-md px-4 py-2 flex-grow text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neon-purple"
            />
            <button className="bg-gradient-game px-6 py-3 rounded-md font-medium whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
