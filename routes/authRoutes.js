const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/users/:memberId', authMiddleware.verifyToken(['Admin']), authController.updateUserBymemberId);
router.delete('/users/:memberId', authMiddleware.verifyToken(['Admin']), authController.deleteUserBymemberId);
router.get('/getusers', authMiddleware.verifyToken(['Admin']), authController.getUsers);
router.get('/users/:memberId', authMiddleware.verifyToken(['Admin']), authController.getUserBymemberId);
router.get('/profile', authMiddleware.verifyToken(['Admin', 'Student']), authController.getProfile);
router.put('/update/profile', authMiddleware.verifyToken(['Admin', 'Student']), authController.updateProfile);

module.exports = router;
