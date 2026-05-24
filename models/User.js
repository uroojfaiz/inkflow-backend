const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true 
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'] 
  },
  
  // Profile Details
  bio: { 
    type: String, 
    default: "Writing my journey on InkFlow." 
  },
  profileImage: { 
    type: String, 
    default: "" 
  },
  
  // FIXED: Social Links ab schema ke andar hain
  socialLinks: {
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    website: { type: String, default: "" }
  },
  
  // Social Stats
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Notifications Array
  notifications: [{
    message: { type: String },
    type: { type: String, enum: ['like', 'follow', 'comment'] },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }]
}, { 
  timestamps: true 
});

// Password match karne ka method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Data bhejte waqt password remove karne ke liye
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);