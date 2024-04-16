const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timetableSchema = new Schema({
  timetableId: { type: String, unique: true, required: true },
  courseId: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  facultyId: { type: String, required: true },
  roomId: { type: String, required: true },
});

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable;
