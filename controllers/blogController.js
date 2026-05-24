const Blog = require('../models/Blog');
const User = require('../models/User');

// --- 1. CREATE BLOG ---
exports.createBlog = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authorized." });
        const { title, content, category, externalUrl } = req.body;
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const newBlog = await Blog.create({
            title, content, category, slug,
            author: req.user._id, authorName: req.user.name || "Unknown",
            coverImage: req.file ? req.file.path : null
        });
        res.status(201).json(newBlog);
    } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
};

// --- 2. GET BLOGS (With Category Filter) ---
exports.getBlogs = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category && category !== "All") {
            query = { category: { $regex: category, $options: 'i' } };
        }
        const blogs = await Blog.find(query).sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) { res.status(500).json({ message: "Error fetching blogs" }); }
};

// --- 3. LIKE BLOG (Toggle) ---
exports.likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog.likes.includes(req.user._id)) {
            blog.likes.push(req.user._id);
        } else {
            blog.likes = blog.likes.filter(id => id.toString() !== req.user._id.toString());
        }
        await blog.save();
        res.status(200).json(blog);
    } catch (error) { res.status(500).json({ message: "Error liking" }); }
};

// --- 4. ADD COMMENT ---
exports.addComment = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        blog.comments.push({ user: req.user._id, text: req.body.text, name: req.user.name });
        await blog.save();
        res.status(200).json(blog);
    } catch (error) { res.status(500).json({ message: "Error commenting" }); }
};

// --- 5. SAVE BLOG ---
exports.saveBlog = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.savedBlogs.includes(req.params.id)) {
            user.savedBlogs.push(req.params.id);
            await user.save();
        }
        res.status(200).json({ message: "Saved!" });
    } catch (error) { res.status(500).json({ message: "Error saving" }); }
};

// --- 6. EXISTING FUNCTIONS (Zaroori hain) ---
exports.getMyBlogs = async (req, res) => {
    const blogs = await Blog.find({ author: req.user._id });
    res.status(200).json(blogs);
};

exports.getBlogById = async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    res.status(200).json(blog);
};

exports.getBlogBySlug = async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug });
    res.status(200).json(blog);
};

exports.getTrending = async (req, res) => {
    const blogs = await Blog.find().sort({ views: -1 }).limit(6);
    res.status(200).json(blogs);
};

exports.updateBlog = async (req, res) => {
    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
};

exports.deleteBlog = async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
};