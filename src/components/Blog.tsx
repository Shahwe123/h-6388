
import { ArrowRight } from "lucide-react";

const blogPosts = [
  {
    title: "How to Platinum Elden Ring in Under 60 Hours",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
    date: "Mar 16, 2024",
    readTime: "5 min read"
  },
  {
    title: "The Secret Achievements Every Hunter Misses",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
    date: "Mar 15, 2024",
    readTime: "3 min read"
  },
  {
    title: "Building Your Trophy Collection: Expert Tips",
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop",
    date: "Mar 14, 2024",
    readTime: "4 min read"
  }
];

const Blog = () => {
  return (
    <section className="py-16 container-padding bg-gradient-to-b from-primary to-black">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold neon-text">Latest Game Guides</h2>
          <a href="#" className="text-neon-purple flex items-center hover:text-neon-pink transition-colors">
            View all
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div key={index} className="glass-card rounded-xl overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
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
      </div>
    </section>
  );
};

export default Blog;
