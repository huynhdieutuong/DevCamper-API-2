const ErrorResponse = require('./errorResponse');

module.exports = (resource, id, next) => {
  if (!resource) {
    return next(new ErrorResponse(`Resource not found with id of ${id}`, 404));
  }
};
