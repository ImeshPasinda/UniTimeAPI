const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// MongoDB connection
connectDB();

// Routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const timeTableRoutes = require('./routes/timetableRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const studentEnrollRoutes = require('./routes/studentEnrollRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/timetable', timeTableRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/enroll', studentEnrollRoutes);
app.use('/api/notifications', notificationRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;