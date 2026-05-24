const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

exports.likeBlog = async (req, res) => {
    // 1. Blog update
    const blog = await Blog.findByIdAndUpdate(req.params.blogId, { $push: { likes: req.user.id } });
    
    // 2. Notification send
    await User.findByIdAndUpdate(blog.author, {
        $push: { notifications: { message: `${req.user.name} liked your post!`, type: 'like' } }
    });
    res.json({ message: "Liked!" });
};