import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import CommentForm from '../components/comments/CommentForm';
import CommentList from '../components/comments/CommentList';
import ConfirmModal from '../components/common/ConfirmModal';

function PostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postService.getPost(slug);
      setPost(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    setShowDeleteModal(false);
    navigate('/posts');
    try {
      await postService.deletePost(post._id);
    } catch (err) {
      alert('Failed to delete post: ' + (err.message || 'Unknown error'));
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!post) return null;

  const canEdit = user && (user.id === post.author._id || user.role === 'admin');

  return (
    <article className="max-w-4xl mx-auto">
      <div className="mb-8">
        {post.featuredImage && post.featuredImage !== 'default-post.jpg' && (
          <img
            src={`/uploads/${post.featuredImage}`}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg mb-6"
          />
        )}
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600 mb-4">
          <div>
            <p className="font-semibold">{post.author.name}</p>
            <p className="text-sm">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        {canEdit && (
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Post
            </button>
            <button
              onClick={() => navigate(`/posts/${post._id}/edit`)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit Post
            </button>
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="bg-red-600 hover:bg-red-700"
      />
      <div
        className="prose max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {user ? (
          <CommentForm postId={post._id} onCommentAdded={fetchPost} />
        ) : (
          <p className="text-gray-600 mb-4">
            Please <a href="/login" className="text-blue-500">login</a> to comment
          </p>
        )}
        <CommentList comments={post.comments} />
      </div>
    </article>
  );
}

export default PostDetail;
