const express = require('express');
const router = express.Router();

const Bootcamp = require('../models/Bootcamp');
const coursesRoute = require('./courses');
const advancedResults = require('../middlewares/advancedResults');
const uploadFile = require('../middlewares/uploadFile');

const {
  getBootcamps,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require('../controllers/bootcamps');

const { protect, authorize } = require('../middlewares/auth');

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router.get('/radius/:zipcode/:distance', getBootcampsInRadius);

router.use('/:bootcampId/courses', coursesRoute);

router.put(
  '/:id/photo',
  protect,
  authorize('publisher', 'admin'),
  uploadFile(Bootcamp, 'image', 2),
  bootcampPhotoUpload
);

module.exports = router;
