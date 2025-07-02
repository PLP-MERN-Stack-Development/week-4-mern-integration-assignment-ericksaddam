// categories.js - Category routes

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/auth');

// Validation middleware
const validateCategory = [
  body('name').trim().isLength({ min: 2, max: 50 }).escape(),
  body('description').optional().trim().isLength({ max: 200 }).escape(),
];

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort('name');
    
    res.json({
      success: true,
      data: categories,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// Create category (open to all authenticated users)
router.post('/', protect, validateCategory, async (req, res) => {
  try {
    // Fallback: set slug if not present
    if (!req.body.slug && req.body.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
    }
    req.body.author = req.user.id;
    const category = new Category(req.body);
    await category.save();

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Category already exists',
      });
    }
    
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Update category (only owner or admin)
router.put('/:id', protect, validateCategory, async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    // Only allow if user is creator or admin
    if (category.author && category.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to update this category' });
    }

    // Update fields
    category.name = req.body.name || category.name;
    category.description = req.body.description || category.description;
    
    // Regenerate slug if name is being updated
    if (req.body.name) {
      category.slug = req.body.name
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
    }

    const updatedCategory = await category.save();

    res.json({
      success: true,
      data: updatedCategory,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'A category with this name already exists',
      });
    }
    
    console.error('Error updating category:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// Delete category (only owner or admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    // Only allow if user is creator or admin
    if (category.author && category.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this category' });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

module.exports = router;
