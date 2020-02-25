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

router
  .route('/:id')
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse);

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getCourses
  )
  .post(addCourse);

module.exports = router;
