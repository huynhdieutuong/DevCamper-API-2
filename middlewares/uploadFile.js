const path = require('path');
const ErrorResponse = require('../utils/errorResponse');

module.exports = (model, fileType, maxSize) => async (req, res, next) => {
  const { id } = req.params;
  const resource = await model.findById(id);

  // Check if not resource
  if (!resource) {
    return next(new ErrorResponse(`Resource not found with id of ${id}`, 404));
  }

  // Check if not file
  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  let { name, size, mimetype, mv } = req.files.file;

  // Check file type
  if (!mimetype.startsWith(fileType)) {
    return next(new ErrorResponse(`Please upload ${fileType} file`, 400));
  }

  // Check file size
  if (size > maxSize * 1024 * 1024) {
    return next(
      new ErrorResponse(
        `Please upload ${fileType} less than ${maxSize} MB`,
        400
      )
    );
  }

  // Create custom filename
  name = `${fileType}_${resource._id}${path.parse(name).ext}`;

  // Upload file
  try {
    await mv(`${process.env.FILE_UPLOAD_PATH}/${name}`);
  } catch (error) {
    console.error(error);
    return next(new ErrorResponse('Problem with file upload', 500));
  }

  res.fileName = name;

  next();
};
