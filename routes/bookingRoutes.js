const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add', authMiddleware.verifyToken(['Admin']), bookingController.bookRoom);
router.put('/update/:bookingId', authMiddleware.verifyToken(['Admin']), bookingController.updateBooking);
router.delete('/delete/:bookingId', authMiddleware.verifyToken(['Admin']), bookingController.deleteBooking);
router.get('/available', authMiddleware.verifyToken(['Admin']), bookingController.getAllAvailableBookings);

module.exports = router;
