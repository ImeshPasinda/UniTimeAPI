const express = require('express');
const router = express.Router();
const studentEnrollController = require('../controllers/studentEnrollController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add', authMiddleware.verifyToken(['Student']), studentEnrollController.enrollStudent);
router.delete('/delete/:studentId', authMiddleware.verifyToken(['Admin', 'Student']), studentEnrollController.deleteEnrollmentByStudentId);
router.get('/all/:studentId', authMiddleware.verifyToken(['Admin', 'Faculty', 'Student']), studentEnrollController.getEnrollmentsByStudentId);

module.exports = router;
