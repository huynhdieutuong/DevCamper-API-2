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

const { protect } = require('../middlewares/auth');

router
  .route('/:id')
  .get(getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getCourses
  )
  .post(protect, addCourse);

module.exports = router;
