import React, { useState, useEffect } from 'react';
import { postService } from '../services/api';
import PostCard from '../components/posts/PostCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Pagination from '../components/common/Pagination';
import CategoryFilter from '../components/posts/CategoryFilter';
import { useApi } from '../hooks/useApi';

function PostList() {
  const {
    data: postsData,
    loading,
    error,
    request: fetchPosts
  } = useApi(async () => postService.getAllPosts(page, 10, selectedCategory));
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchPosts().then((response) => {
      if (response && response.data) {
        setPosts(response.data);
        setTotalPages(response.pagination.pages);
      }
    });
  }, [page, selectedCategory]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

export default PostList;
