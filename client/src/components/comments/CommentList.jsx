import React from 'react';

function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return <p className="text-gray-500">No comments yet.</p>;
  }
  return (
    <ul className="space-y-4">
      {comments.map((comment) => (
        <li key={comment._id} className="bg-gray-100 rounded p-4">
          <div className="flex items-center mb-2">
            <img
              src={comment.user?.avatar || '/default-avatar.jpg'}
              alt={comment.user?.name || 'User'}
              className="w-8 h-8 rounded-full mr-3"
            />
            <span className="font-semibold">{comment.user?.name || 'User'}</span>
            <span className="ml-2 text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="text-gray-700">{comment.content}</p>
        </li>
      ))}
    </ul>
  );
}

export default CommentList;
