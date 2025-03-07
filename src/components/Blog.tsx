
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
    <section className="py-16 container-padding bg-gradient-to-b from-black to-primary">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
          Trophy Hunting Tips & Guides
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {blogPosts.map((post, index) => (
            <div key={index} className="glass-card rounded-xl overflow-hidden group cursor-pointer border border-neon-purple/10 hover:border-neon-purple/30 transition-colors">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-neon-purple mb-2">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-semibold text-white group-hover:text-neon-pink transition-colors">
                  {post.title}
                </h3>
                <button className="mt-4 text-sm text-neon-purple flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read More <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
