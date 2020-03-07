const asyncHandler = require('../middlewares/async');
const User = require('../models/User');
const sendTokenResponse = require('../utils/sendTokenResponse');

// @desc    Register user
// @route   POST  /api/v2/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, role, password } = req.body;

  const user = await User.create({ name, email, role, password });

  sendTokenResponse(user, 200, res);
});
