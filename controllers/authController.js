const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT Helper
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 1. REGISTER
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "Sabhi fields bharein!" });

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User pehle se exist karta hai" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword });

        if (user) {
            res.status(201).json({ _id: user.id, name: user.name, email: user.email, token: generateToken(user._id) });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// 2. LOGIN
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({ _id: user.id, name: user.name, email: user.email, token: generateToken(user._id) });
        } else {
            res.status(401).json({ message: "Invalid email ya password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// 3. GET PROFILE
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); 
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Profile load nahi ho payi" });
    }
};

// 4. UPDATE PROFILE (Updated with Social Links)
const updateProfile = async (req, res) => {
    try {
        const { name, bio, profileImage, socialLinks } = req.body;
        
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = name || user.name;
            user.bio = bio || user.bio;
            user.profileImage = profileImage || user.profileImage;
            
            // Social Links Update Logic
            if (socialLinks) {
                user.socialLinks = {
                    linkedin: socialLinks.linkedin || user.socialLinks.linkedin,
                    twitter: socialLinks.twitter || user.socialLinks.twitter,
                    website: socialLinks.website || user.socialLinks.website
                };
            }

            const updatedUser = await user.save();

            res.json({
                user: updatedUser
            });
        } else {
            res.status(404).json({ message: "User nahi mila" });
        }
    } catch (error) {
        res.status(500).json({ message: "Update fail ho gaya", error: error.message });
    }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };