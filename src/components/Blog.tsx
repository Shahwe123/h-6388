
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Blog posts data array
 * Each object represents a blog post with title, image, date, and read time
 */
const blogPosts = [
  {
    id: 1,
    title: "🏆 Why We Built PlatinumPath: A Better Way to Track Game Achievements",
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    date: "June 5, 2024",
    readTime: "5 min read"
  }
];

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
          <h2 className="text-3xl font-bold neon-text">Latest Blog Posts</h2>
          <Link to="/blog" className="text-neon-purple flex items-center hover:text-neon-pink transition-colors">
            View all
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {/* Blog posts grid */}
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
