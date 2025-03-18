
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

interface BlogPostProps {
  post: {
    title: string;
    date: string;
    content: React.ReactNode;
    metaDescription: string;
  };
}

const BlogPost = ({ post }: BlogPostProps) => {
  return (
    <div className="min-h-screen bg-primary pt-24 pb-16">
      <SEO 
        title={post.title}
        description={post.metaDescription}
      />
      <div className="max-w-4xl mx-auto container-padding">
        <Link to="/blog" className="text-neon-purple flex items-center hover:text-neon-pink transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Blog
        </Link>
        
        <article className="prose prose-invert max-w-none">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="text-neutral-400">{post.date}</div>
          </header>
          
          <div className="glass-card p-8 rounded-xl">
            {post.content}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
