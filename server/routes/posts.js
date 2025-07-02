// posts.js - Post routes

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const Post = require('../models/Post');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: './uploads/posts',
  filename: function (req, file, cb) {
    cb(null, `post-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Validation middleware
const validatePost = [
  body('title').trim().isLength({ min: 3, max: 100 }).escape(),
  body('content').trim().isLength({ min: 10 }).escape(),
  body('category').isMongoId(),
];

// Get all posts
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;

    const query = category ? { category } : {};
    
    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// Get single post
router.get('/:idOrSlug', async (req, res) => {
  try {
    let post;
    if (mongoose.Types.ObjectId.isValid(req.params.idOrSlug)) {
      post = await Post.findOne({
        _id: req.params.idOrSlug,
      })
        .populate('author', 'name avatar')
        .populate('category', 'name')
        .populate('comments.user', 'name avatar');
    } else {
      post = await Post.findOne({
        slug: req.params.idOrSlug,
      })
        .populate('author', 'name avatar')
        .populate('category', 'name')
        .populate('comments.user', 'name avatar');
    }

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    await post.incrementViewCount();

    res.json({
      success: true,
      data: post,
    });
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }
});

// Create post
router.post(
  '/',
  protect,
  upload.single('featuredImage'),
  validatePost,
  async (req, res) => {
    try {
      // Fallback: set slug if not present
      if (!req.body.slug && req.body.title) {
        req.body.slug = req.body.title
          .toLowerCase()
          .replace(/[^\w ]+/g, '')
          .replace(/ +/g, '-');
      }
      const post = new Post({
        ...req.body,
        author: req.user.id,
        featuredImage: req.file ? req.file.filename : undefined,
      });

      await post.save();

      res.status(201).json({
        success: true,
        data: post,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

// Update post
router.put(
  '/:id',
  protect,
  upload.single('featuredImage'),
  validatePost,
  async (req, res) => {
    try {
      let post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found',
        });
      }

      // Make sure user is post author or admin
      if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({
          success: false,
          error: 'Not authorized to update this post',
        });
      }

      const updateData = {
        ...req.body,
      };
      // Fallback: set slug if not present but title is present
      if (!updateData.slug && updateData.title) {
        updateData.slug = updateData.title
          .toLowerCase()
          .replace(/[^\w ]+/g, '')
          .replace(/ +/g, '-');
      }

      if (req.file) {
        updateData.featuredImage = req.file.filename;
      }

      post = await Post.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });

      res.json({
        success: true,
        data: post,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

// Delete post
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Make sure user is post author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this post',
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// Add comment
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    await post.addComment(req.user.id, req.body.content);

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// Search posts
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a search query',
      });
    }

    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ],
    })
      .populate('author', 'name avatar')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

module.exports = router;
