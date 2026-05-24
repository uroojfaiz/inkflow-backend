const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Library ko import karne ka universal tareeka
const multerStorage = require('multer-storage-cloudinary');
const CloudinaryStorage = multerStorage.CloudinaryStorage || multerStorage;

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'inkflow_blogs',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };