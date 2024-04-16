const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add', authMiddleware.verifyToken(['Admin']), roomController.createRoom);
router.get('/all', authMiddleware.verifyToken(['Admin']), roomController.getAllRooms);
router.get('/get/:roomId', authMiddleware.verifyToken(['Admin', 'Student']), roomController.getRoomById);
router.put('/update/:roomId', authMiddleware.verifyToken(['Admin']), roomController.updateRoomById);
router.delete('/delete/:roomId', authMiddleware.verifyToken(['Admin']), roomController.deleteRoomById);

module.exports = router;
