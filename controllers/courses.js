const asyncHandler = require('../middlewares/async');
const Course = require('../models/Course');

// @desc    Get courses for bootcamp || Get all courses
// @route   GET /api/v2/bootcamp/:bootcampId/courses || GET /api/v2/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  if (bootcampId) {
    const courses = await Course.find({ bootcamp: bootcampId });
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});
