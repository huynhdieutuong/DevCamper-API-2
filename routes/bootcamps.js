const express = require('express');
const router = express.Router();

const Bootcamp = require('../models/Bootcamp');

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
  .get(advancedResults(Bootcamp), getBootcamps)
  .post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.get('/radius/:zipcode/:distance', getBootcampsInRadius);

module.exports = router;
