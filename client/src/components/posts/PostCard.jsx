import React from 'react';
import { Link } from 'react-router-dom';

function PostCard({ post }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      {post.featuredImage && post.featuredImage !== 'default-post.jpg' && (
        <img
          src={`/uploads/${post.featuredImage}`}
          alt={post.title}
          className="w-full h-48 object-cover rounded mb-4"
        />
      )}
      <h2 className="text-xl font-bold mb-2">
        <Link to={`/posts/${post.slug}`}>{post.title}</Link>
      </h2>
      <p className="text-gray-600 mb-2 line-clamp-3">{post.excerpt || post.content.slice(0, 100) + '...'}</p>
      <div className="flex items-center text-sm text-gray-500 mt-auto">
        <span>By {post.author?.name || 'Unknown'}</span>
        <span className="mx-2">•</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

export default PostCard;
