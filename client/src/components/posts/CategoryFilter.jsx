import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/api';

function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await categoryService.getAllCategories();
        setCategories(res.data);
      } catch {
        setCategories([]);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="mb-6">
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="border rounded px-3 py-2"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategoryFilter;
