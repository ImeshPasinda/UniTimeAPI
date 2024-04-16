const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  credits: { type: Number, required: true },
  facultyId: { type: String, required: true },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
