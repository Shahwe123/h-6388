
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { blogPosts } from "@/data/blogPosts";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { ArrowLeft } from "lucide-react";

/**
 * BlogPost component
 * 
 * Displays a full blog post based on the URL parameter.
 * If the blog post doesn't exist, it navigates back to the blog list.
 * 
 * @returns {JSX.Element} Full blog post page
 */
const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the blog post by id
  const post = blogPosts.find(post => post.id === id);
  
  // If post doesn't exist, redirect to blog page
  useEffect(() => {
    if (!post) {
      navigate("/blog");
    }
  }, [post, navigate]);
  
  // If post is not found, show nothing (redirection will happen)
  if (!post) return null;
  
  return (
    <div className="min-h-screen bg-primary">
      <SEO 
        title={post.title}
        description={post.excerpt}
      />
      <Header />
      
      <main className="container-padding py-16 max-w-4xl mx-auto">
        <button 
          onClick={() => navigate("/blog")} 
          className="flex items-center text-neutral-300 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all posts
        </button>
        
        <article>
          <div className="mb-8">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-64 md:h-80 object-cover rounded-xl"
            />
          </div>
          
          <div className="flex justify-between items-center mb-6 text-sm text-neutral-400">
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">{post.title}</h1>
          
          {post.content}
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
