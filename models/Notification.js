const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
