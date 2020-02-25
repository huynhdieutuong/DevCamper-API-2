const express = require('express');
const router = express.Router({ mergeParams: true });

const advancedResults = require('../middlewares/advancedResults');
const Course = require('../models/Course');

const { getCourses } = require('../controllers/courses');

router.route('/').get(advancedResults(Course), getCourses);

module.exports = router;
