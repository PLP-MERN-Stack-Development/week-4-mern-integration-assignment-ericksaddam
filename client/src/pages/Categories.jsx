import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { FaLock, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/common/ConfirmModal';

function Categories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, [user]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();
      // Handle different response formats
      let categoriesData = [];
      if (Array.isArray(response)) {
        categoriesData = response;
      } else if (response && response.data) {
        categoriesData = Array.isArray(response.data) ? response.data : [];
      } else if (response && response.categories) {
        categoriesData = Array.isArray(response.categories) ? response.categories : [];
      }
      console.log('Loaded categories:', categoriesData); // Debug log
      setCategories(categoriesData);
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to load categories';
      setError(errorMessage);
      console.error('Error loading categories:', err);
      setCategories([]); // Ensure categories is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const categoryName = newCategory.trim();
    if (!categoryName) return;
    
    try {
      setLoading(true);
      setError('');
      
      console.log('Creating category:', categoryName);
      const response = await categoryService.createCategory({ 
        name: categoryName,
        description: '' // Add empty description as it's required
      });
      
      console.log('Category creation response:', response);
      
      // Handle different response formats
      if (response && response.error) {
        throw new Error(response.error);
      }
      
      if (response && response.data && response.data.error) {
        throw new Error(response.data.error);
      }
      
      setNewCategory('');
      toast.success('Category created successfully');
      await loadCategories();
    } catch (err) {
      console.error('Error in handleCreateCategory:', err);
      const errorMessage = err.response?.data?.error || 
                         err.message || 
                         'Failed to create category. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    const categoryName = newCategory.trim();
    if (!categoryName || !editingCategory) return;
    
    try {
      setLoading(true);
      setError('');
      
      console.log(`Updating category ${editingCategory._id}:`, categoryName);
      await categoryService.updateCategory(editingCategory._id, { 
        name: categoryName,
        description: editingCategory.description || ''
      });
      
      toast.success('Category updated successfully');
      setNewCategory('');
      setEditingCategory(null);
      await loadCategories();
    } catch (err) {
      console.error('Error updating category:', err);
      const errorMessage = err.response?.data?.error || 
                         err.message || 
                         'Failed to update category. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    
    try {
      setLoading(true);
      await categoryService.deleteCategory(categoryToDelete._id);
      toast.success('Category deleted successfully');
      await loadCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      const errorMessage = err.response?.data?.error || 
                         err.message || 
                         'Failed to delete category. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const startEditing = (category) => {
    setEditingCategory(category);
    setNewCategory(category.name);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setNewCategory('');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>
      
      {error && <ErrorMessage message={error} className="mb-4" />}
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingCategory ? 'Edit Category' : 'Create New Category'}
        </h2>
        <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory} className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading 
              ? (editingCategory ? 'Updating...' : 'Creating...') 
              : (editingCategory ? 'Update' : 'Create')}
          </button>
          {editingCategory && (
            <button
              type="button"
              onClick={cancelEditing}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
        {loading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : !categories || categories.length === 0 ? (
          <p className="text-gray-500">No categories found. Create your first category above.</p>
        ) : (
          <ul className="space-y-2">
            {Array.isArray(categories) && categories.map((category) => (
              <li 
                key={category._id || category.id || Math.random().toString(36).substr(2, 9)}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <span className={editingCategory?._id === category._id ? 'font-bold text-blue-600' : ''}>
                  {category.name}
                </span>
                {/* Remove isAdmin check so all users see edit/delete */}
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(category)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit category"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete category"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${categoryToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
}

export default Categories;
