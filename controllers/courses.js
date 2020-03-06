const asyncHandler = require('../middlewares/async');
const ifNotResource = require('../utils/ifNotResource');

const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get courses for bootcamp || Get all courses
// @route   GET /api/v2/bootcamp/:bootcampId/courses || GET /api/v2/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  if (bootcampId) {
    const courses = await Course.find({ bootcamp: bootcampId }).populate({
      path: 'bootcamp',
      select: 'name description'
    });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single course
// @route   GET /api/v2/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findById(id).populate({
    path: 'bootcamp',
    select: 'name description'
  });

  ifNotResource(course, id, next);

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Add a course for bootcamp
// @route   POST /api/v2/bootcamp/:bootcampId/courses
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;
  const bootcamp = await Bootcamp.findById(bootcampId);

  ifNotResource(bootcamp, bootcampId, next);

  req.body.bootcamp = bootcampId;
  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course
  });
});

// @desc    Update course
// @route   PUT /api/v2/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let course = await Course.findById(id);

  ifNotResource(course, id, next);

  course = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Delete course
// @route   DELETE /api/v2/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findById(id);

  ifNotResource(course, id, next);

  await course.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
