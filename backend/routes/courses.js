const express = require('express');
const router = express.Router();
const {
    getAllCourses,
    getCourseById,
    createCourse,
    enrollInCourse,
    updateCourse,
    deleteCourse  
} = require('../controllers/courseController');
const auth = require('../middleware/authMiddleware');


router.get('/', getAllCourses);
router.get('/:id', getCourseById);

router.post('/', auth, createCourse);
router.put('/:id', auth, updateCourse); 
router.delete('/:id', auth, deleteCourse); 
router.post('/:id/enroll', auth, enrollInCourse);

module.exports = router;