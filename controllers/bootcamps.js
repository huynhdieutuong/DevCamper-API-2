const asyncHandler = require('../middlewares/async');
const Bootcamp = require('../models/Bootcamp');
const ifNotResource = require('../utils/ifNotResource');
const geoCoder = require('../utils/geoCoder');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all bootcamps
// @route   GET /api/v2/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get bootcamps within radius
// @route   GET /api/v2/bootcamps/radius/:zipcode/:distance
// @access  Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get longitude and latitude from zipcode
  const loc = await geoCoder.geocode(zipcode);
  const { longitude, latitude } = loc[0];

  // Convert distance to radians
  const radius = distance / 3963.2;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] }
    }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

// @desc    Create new bootcamp
// @route   POST /api/v2/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  // If user is not an admin, they can only add one bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp
  });
});

// @desc    Get single bootcamp
// @route   GET /api/v2/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate('courses');

  ifNotResource(bootcamp, req.params.id, next);

  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

// @desc    Update bootcamp
// @route   PUT /api/v2/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  ifNotResource(bootcamp, req.params.id, next);

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

// @desc    Delete bootcamp
// @route   DELETE /api/v2/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  ifNotResource(bootcamp, req.params.id, next);

  await bootcamp.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload photo for bootcamp
// @route   PUT /api/v2/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  await Bootcamp.findByIdAndUpdate(req.params.id, { photo: res.fileName });

  res.status(200).json({
    success: true,
    data: res.fileName
  });
});
