
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { blogPosts } from "../data/blogPosts";

const Blog = () => {
  return (
    <section className="py-16 container-padding bg-gradient-to-b from-primary to-black">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold neon-text">Latest Blog Posts</h2>
          <Link to="/blog" className="text-neon-purple flex items-center hover:text-neon-pink transition-colors">
            View all
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="glass-card rounded-xl overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex justify-between items-center mb-3 text-sm text-neutral-300">
                  <span>{post.date}</span>
                  <span>5 min read</span>
                </div>
                <h3 className="font-bold text-lg mb-3 text-white">{post.title}</h3>
                <Link to={`/blog/${post.id}`} className="text-neon-purple flex items-center hover:text-neon-pink transition-colors text-sm">
                  Read more
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
          
          {blogPosts.length < 3 && Array(3 - blogPosts.length).fill(0).map((_, index) => (
            <div key={`placeholder-${index}`} className="glass-card rounded-xl overflow-hidden">
              <div className="h-48 bg-black/50 flex items-center justify-center">
                <p className="text-neutral-500">Coming soon</p>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3 text-sm text-neutral-500">
                  <span>Upcoming</span>
                </div>
                <h3 className="font-bold text-lg mb-3 text-neutral-500">New content in the works</h3>
                <span className="text-neutral-600 text-sm">Stay tuned</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
