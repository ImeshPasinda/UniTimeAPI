const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentEnrollSchema = new Schema({
  studentId: { type: String, required: true },
  courseId: { type: String, required: true },
  enrollmentDate: { type: Date, default: Date.now },
});

const StudentEnroll = mongoose.model('StudentEnroll', studentEnrollSchema);

module.exports = StudentEnroll;
