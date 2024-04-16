const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add', authMiddleware.verifyToken(['Admin']), timetableController.createTimetable);
router.get('/all', authMiddleware.verifyToken(['Admin', 'Student', 'Faculty']), timetableController.getAllTimetableEntriesBytimetableId);
router.put('/update/:timetableId', authMiddleware.verifyToken(['Admin']), timetableController.updateTimetableEntryBytimetableId);
router.delete('/delete/:timetableId', authMiddleware.verifyToken(['Admin']), timetableController.deleteTimetableEntryBytimetableId);

module.exports = router;
