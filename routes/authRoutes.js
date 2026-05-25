const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification'); // Notification model import
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- PROTECT MIDDLEWARE ---
const protect = (req, res, next) => {
    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer')) {
        try {
            token = token.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; 
            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized" });
        }
    } else {
        res.status(401).json({ message: "No token, authorization denied" });
    }
};

// --- ROUTES ---

// REGISTER & LOGIN (Existing logic same rahega)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ _id: user._id, name: user.name });
    } catch (error) {
        res.status(500).json({ message: "Register error", error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, name: user.name });
    } catch (error) {
        res.status(500).json({ message: "Login error", error: error.message });
    }
});

// GET PROFILE (Added stats: followers, following, likes)
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: "User nahi mila" });
        
        // Stats calculate karein
        const userData = {
            ...user._doc,
            followers: user.followers ? user.followers.length : 0,
            following: user.following ? user.following.length : 0,
            totalLikes: user.totalLikes || 0
        };
        res.json({ user: userData });
    } catch (error) {
        res.status(500).json({ message: "Profile error", error: error.message });
    }
});

// UPDATE PROFILE
router.put('/update-profile', protect, async (req, res) => {
    try {
        const { name, bio, profileImage } = req.body;
        const user = await User.findById(req.user.id);
        if (user) {
            user.name = name || user.name;
            user.bio = bio || user.bio;
            user.profileImage = profileImage || user.profileImage;
            const updatedUser = await user.save();
            res.json({ user: updatedUser });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Update error", error: error.message });
    }
});

// GET NOTIFICATIONS
router.get('/notifications', protect, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate('sender', 'name'); // Sender ka naam lana
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
});

module.exports = router;