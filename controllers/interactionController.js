const Blog = require('../models/Blog');
const User = require('../models/User');

// 1. LIKE / UNLIKE
exports.likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        const userId = req.user._id;
        if (blog.likes.includes(userId)) {
            blog.likes = blog.likes.filter(id => id.toString() !== userId.toString());
        } else {
            blog.likes.push(userId);
        }
        await blog.save();
        res.status(200).json(blog);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 2. ADD COMMENT
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const blog = await Blog.findById(req.params.blogId);
        blog.comments.push({ user: req.user.name, text });
        await blog.save();
        res.status(200).json(blog);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 3. FOLLOW USER
exports.followUser = async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.targetUserId);
        const currentUser = await User.findById(req.user._id);
        
        if (!targetUser.followers.includes(currentUser._id)) {
            targetUser.followers.push(currentUser._id);
            currentUser.following.push(targetUser._id);
            await targetUser.save();
            await currentUser.save();
        }
        res.status(200).json({ message: "Followed successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 4. SAVE BLOG
exports.saveBlog = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.savedBlogs.includes(req.params.blogId)) {
            user.savedBlogs.push(req.params.blogId);
            await user.save();
        }
        res.status(200).json({ message: "Blog saved" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};