const express = require('express');
const router = express.Router({ mergeParams: true });

const advancedResults = require('../middlewares/advancedResults');
const Course = require('../models/Course');

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courses');

const { protect, authorize } = require('../middlewares/auth');

router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse);

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getCourses
  )
  .post(protect, authorize('publisher', 'admin'), addCourse);

module.exports = router;
