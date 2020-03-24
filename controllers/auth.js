const crypto = require('crypto');
const asyncHandler = require('../middlewares/async');
const User = require('../models/User');
const sendTokenResponse = require('../utils/sendTokenResponse');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

// @desc    Register user
// @route   POST  /api/v2/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, role, password } = req.body;

  const user = await User.create({ name, email, role, password });

  sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST  /api/v2/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check for password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get logged in user
// @route   GET  /api/v2/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
});

// @desc    Forgot password
// @route   POST  /api/v2/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorResponse(
        `There is no user with the email address ${req.body.email}`,
        404
      )
    );
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Send email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v2/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password.\nPlease make a PUT request to: ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset Password Token',
      text: message
    });

    res.status(200).json({
      success: true,
      data: 'Email sent'
    });
  } catch (error) {
    console.error(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Reset email could not be send', 500));
  }
});

// @desc    Reset password
// @route   PUT  /api/v2/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Reset password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});
