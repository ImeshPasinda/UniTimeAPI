const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/courses', authMiddleware.verifyToken(['Admin']), courseController.createCourse);
router.get('/courses', authMiddleware.verifyToken(['Admin']), courseController.getAllCourses);
router.get('/courses/:courseId', authMiddleware.verifyToken(['Admin']), courseController.getCourseBycourseId);
router.put('/courses/:courseId', authMiddleware.verifyToken(['Admin']), courseController.updateCourseBycourseId);
router.delete('/courses/:courseId', authMiddleware.verifyToken(['Admin']), courseController.deleteCourseById);

module.exports = router;
