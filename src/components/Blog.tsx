
import { ArrowRight } from "lucide-react";

/**
 * Blog posts data array
 * Each object represents a blog post with title, image, date, and read time
 */
const blogPosts = [];

/**
 * Blog component
 * 
 * Displays a section with the latest blog posts or game guides.
 * Each post shows a thumbnail image, title, date, and read time.
 * 
 * @returns {JSX.Element} The blog section UI
 */
const Blog = () => {
  return (
    <section className="py-16 container-padding bg-gradient-to-b from-primary to-black">
      <div className="max-w-4xl mx-auto">
        {/* Section heading with "View all" link */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold neon-text">Latest Game Guides</h2>
          <a href="#" className="text-neon-purple flex items-center hover:text-neon-pink transition-colors">
            View all
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>
        
        {/* Blog posts grid */}
        {blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
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
                  <a href="#" className="text-neon-purple flex items-center hover:text-neon-pink transition-colors text-sm">
                    Read more
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-8 text-center">
            <p className="text-neutral-300 mb-4">No game guides available yet.</p>
            <p className="text-sm text-neutral-400">Check back soon for expert tips and walkthroughs!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
