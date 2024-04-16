const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  roomId: { type: String, unique: true, required: true },
  roomType: { type: String, required: true },
  capacity: { type: Number, required: true },
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
