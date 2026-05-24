import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/User.js'; // Aapka User model

const router = express.Router();

// Cloudinary Config
cloudinary.config({
  cloud_name: 'YOUR_CLOUD_NAME',
  api_key: 'YOUR_API_KEY',
  api_secret: 'YOUR_API_SECRET'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'profile_pics' },
});

const upload = multer({ storage: storage });

// Update Profile Route
router.put('/update', upload.single('image'), async (req, res) => {
  try {
    const { username, bio } = req.body;
    const updateData = { username, bio };
    
    // Agar image upload hui hai toh uska URL save karein
    if (req.file) {
      updateData.profilePic = req.file.path;
    }

    // MongoDB mein update
    await User.findByIdAndUpdate(req.userId, updateData, { new: true });
    
    res.status(200).json({ message: "Profile Updated Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;