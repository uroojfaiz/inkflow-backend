const express = require('express');
const router = express.Router();
const { likeBlog, addComment, followUser, saveBlog } = require('../controllers/interactionController');
const { protect } = require('../middleware/authMiddleware');

// Method PUT ya POST jo aapke Controller mein hai wahi rakhein (Maine PUT kar diya hai)
router.put('/like/:blogId', protect, likeBlog); 
router.post('/comment/:blogId', protect, addComment);
router.post('/follow/:targetUserId', protect, followUser);
router.post('/save/:blogId', protect, saveBlog);

module.exports = router;