const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  memberId: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Student' },
});

userSchema.pre('save', function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

