const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true, 
    });
    console.log('MongoDB connection successful!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); 
  }
};

module.exports = connectDB;
