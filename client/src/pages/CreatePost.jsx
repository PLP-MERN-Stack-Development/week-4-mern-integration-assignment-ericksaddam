import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService, categoryService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
  });
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await categoryService.getAllCategories();
        setCategories(res.data);
      } catch (err) {
        setError('Failed to load categories');
      }
    }
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCategoryChange = (e) => {
    if (e.target.value === '__add_new__') {
      setShowAddCategory(true);
      setForm((prev) => ({ ...prev, category: '' }));
    } else {
      setShowAddCategory(false);
      setForm((prev) => ({ ...prev, category: e.target.value }));
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setLoading(true);
    try {
      const res = await categoryService.createCategory({ name: newCategoryName });
      // Re-fetch categories to ensure up-to-date list
      const updated = await categoryService.getAllCategories();
      const updatedCategories = updated.data || updated;
      setCategories(updatedCategories);
      // Select the new category
      setForm((prev) => ({ ...prev, category: res.data._id }));
      setShowAddCategory(false);
      setNewCategoryName('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const postData = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        featuredImage: image,
      };
      await postService.createPost(postData);
      navigate('/posts');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // Move add category UI outside the main form to avoid nested <form> warning
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      {error && <ErrorMessage message={error} />}
      {showAddCategory && (
        <div className="mb-4 p-4 bg-gray-50 rounded border">
          <label className="block mb-1 font-medium">New Category Name</label>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            className="flex-1 p-2 border rounded mb-2"
            required
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddCategory}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              onClick={() => { setShowAddCategory(false); setNewCategoryName(''); }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={8}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleCategoryChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select category</option>
            <option value="__add_new__">+ Add new category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Featured Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
