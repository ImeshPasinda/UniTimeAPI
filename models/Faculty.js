const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const facultySchema = new Schema({
  facultyId: { type: String, unique: true, required: true },
  facultyName: { type: String, required: true },
  facultyEmail: { type: String, unique: true, required: true },
});

const Faculty = mongoose.model('Faculty', facultySchema);

module.exports = Faculty;
