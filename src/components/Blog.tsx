
import { ArrowRight } from "lucide-react";
import { Helmet } from 'react-helmet-async';
import { Link } from "react-router-dom";

/**
 * Sample blog posts data array
 * Each object represents a blog post with title, image, date, and read time
 */
const blogPosts = [
  {
    id: 1,
    title: "Mastering Elden Ring Achievements",
    image: "https://images.unsplash.com/photo-1605899435973-ca2d1a8431cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "Aug 15, 2023",
    readTime: "8 min read",
    excerpt: "A comprehensive guide to earning all achievements in Elden Ring.",
    url: "/blog/mastering-elden-ring-achievements"
  },
  {
    id: 2,
    title: "Trophy Hunting Strategies for Beginners",
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "July 27, 2023",
    readTime: "5 min read",
    excerpt: "Essential tips for those just starting their trophy hunting journey.",
    url: "/blog/trophy-hunting-beginners"
  },
  {
    id: 3,
    title: "Hidden Achievements in Popular Games",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "June 12, 2023",
    readTime: "6 min read",
    excerpt: "Discover secret achievements that most players miss in top games.",
    url: "/blog/hidden-achievements"
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
  // Create structured data for the blog posts
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": blogPosts.map((post, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Article",
        "headline": post.title,
        "image": post.image,
        "datePublished": post.date,
        "url": `https://platinumpath.net${post.url}`
      }
    }))
  };
  
  return (
    <section className="py-16 container-padding bg-gradient-to-b from-primary to-black">
      {/* Add structured data for better SEO */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
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
                  <Link to={post.url} className="text-neon-purple flex items-center hover:text-neon-pink transition-colors text-sm">
                    Read more
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
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
