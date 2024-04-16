const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    bookingId: { type: String, required: true, unique: true },
    roomId: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    memberId: { type: String, required: true }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
