
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import BlogPostComponent from '../components/BlogPost';
import { blogPosts } from '../data/blogPosts';

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find(post => post.id === Number(id));

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return <BlogPostComponent post={post} />;
};

export default BlogPost;
