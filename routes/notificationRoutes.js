const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add/', notificationController.postNotificationForUser);
router.get('/get/:user', authMiddleware.verifyToken(['Admin', 'Faculty', 'Student']), notificationController.getNotificationsByUser);

module.exports = router;
