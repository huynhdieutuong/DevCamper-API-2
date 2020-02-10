module.exports = (model, populate) => async (req, res, next) => {
  const { select, sort, page, limit } = req.query;
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);

  // Finding resource
  query = model.find(reqQuery);

  // Select
  if (select) {
    query = query.select(select.split(',').join(' '));
  }

  // Sort
  if (sort) {
    query = query.sort(sort);
  } else {
    query = query.sort('-createAt');
  }

  // Populate
  if (populate) {
    query = query.populate(populate);
  }

  // Executing query
  let results = await query;

  // Pagination
  const pageN = parseInt(page) || 1;
  const limitN = parseInt(limit) || 10;
  const startIndex = (pageN - 1) * limitN;
  const endIndex = pageN * limitN;
  const total = results.length;

  results = results.slice(startIndex, endIndex);

  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: pageN + 1
    };
  }
  if (startIndex > 0) {
    pagination.pre = {
      page: pageN - 1
    };
  }

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(total / limitN); i++) {
    pageNumbers.push(i);
  }
  pagination.pageNumbers = pageNumbers;

  // Advanced results
  res.advancedResults = {
    success: true,
    count: total,
    data: results,
    pagination
  };

  next();
};
