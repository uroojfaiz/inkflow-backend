const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Jisne notification dekhni hai
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Jisne action kiya (follow/like)
    message: String,
    type: { type: String, enum: ['follow', 'like', 'comment'] },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);