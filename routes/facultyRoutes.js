const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/', authMiddleware.verifyToken(['Admin']), facultyController.createFaculty);
router.get('/', facultyController.getAllFaculties);
router.put('/:facultyId', authMiddleware.verifyToken(['Admin']), facultyController.updateFaculty);
router.delete('/:facultyId', authMiddleware.verifyToken(['Admin']), facultyController.deleteFaculty);


module.exports = router;
