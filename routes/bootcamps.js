const express = require('express');
const router = express.Router();

const Bootcamp = require('../models/Bootcamp');
const coursesRoute = require('./courses');
const advancedResults = require('../middlewares/advancedResults');

const {
  getBootcamps,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius
} = require('../controllers/bootcamps');

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.get('/radius/:zipcode/:distance', getBootcampsInRadius);

router.use('/:bootcampId/courses', coursesRoute);

module.exports = router;
