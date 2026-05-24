const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// --- Routes ---

// 1. ADD THIS ROUTE: (Ise hamesha upar rakhein)
router.get('/my-blogs', protect, blogController.getMyBlogs);

// 2. Existing Routes
router.get('/', blogController.getBlogs);
router.get('/trending', blogController.getTrending);
router.post('/create', protect, upload.single('coverImage'), blogController.createBlog);

router.get('/:id', blogController.getBlogById);
router.get('/slug/:slug', blogController.getBlogBySlug);
router.put('/:id', protect, blogController.updateBlog);
router.delete('/:id', protect, blogController.deleteBlog);
router.post('/:id/like', protect, blogController.likeBlog);
router.post('/:id/comment', protect, blogController.addComment);

module.exports = router;