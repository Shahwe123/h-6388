
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";

/**
 * Blog component
 * 
 * Displays a section with the latest blog posts or game guides.
 * Each post shows a thumbnail image, title, date, and read time.
 * 
 * @returns {JSX.Element} The blog section UI
 */
const Blog = () => {
  // Use the posts from our data file
  const displayPosts = blogPosts.slice(0, 3); // Only show up to 3 posts

  return (
    <section className="py-16 container-padding bg-gradient-to-b from-primary to-black">
      <div className="max-w-4xl mx-auto">
        {/* Section heading with "View all" link */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold neon-text">Latest Game Guides</h2>
          <Link to="/blog" className="text-neon-purple flex items-center hover:text-neon-pink transition-colors">
            View all
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {/* Blog posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayPosts.map((post, index) => (
            <div key={index} className="glass-card rounded-xl overflow-hidden">
              {/* Post thumbnail */}
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              {/* Post details */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-3 text-sm text-neutral-300">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-bold text-lg mb-3 text-white">{post.title}</h3>
                <Link to={`/blog/${post.id}`} className="text-neon-purple flex items-center hover:text-neon-pink transition-colors text-sm">
                  Read more
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
