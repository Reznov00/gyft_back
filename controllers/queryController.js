const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Query = require('../models/Query');
const user = require('../models/User');
const User = user.Model;

// @desc      Get all queries
// @route     GET /api/admin/queries
// @access    Admin
exports.getQueries_Admin = asyncHandler(async (req, res, next) => {
  const queries = await Query.find();
  res.status(200).json({
    success: true,
    count: queries.length,
    data: queries,
  });
  next();
});

// @desc      Get all queries
// @route     GET /api/queries/:user
// @access    Volunteer
exports.getQueries = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.user);
  const queries = await Query.find({
    $and: [
      { category: { $eq: user.volunteer.category } },
      { answer: { $exists: false } },
      { 'postedBy._id': { $ne: user._id } },
    ],
  });
  if (!queries)
    return next(new ErrorResponse(404, 'Error while fetching queries'));
  if (queries.length == 0)
    return next(new ErrorResponse(200, 'No queries found'));
  res.status(200).json({
    success: true,
    count: queries.length,
    data: queries,
  });
  next();
});

// @desc      Get queries by a signle user
// @route     GET /api/queries/posted/:user
// @access    Volunteer
exports.getQueriesByUser = asyncHandler(async (req, res, next) => {
  const queries = await Query.find({ 'postedBy._id': req.params.user });
  if (!queries)
    return next(new ErrorResponse(404, 'Error while fetching queries'));
  if (queries.length == 0)
    return next(new ErrorResponse(200, 'No queries found'));
  res.status(200).json({
    success: true,
    count: queries.length,
    data: queries,
  });
  next();
});

// @desc      Add Answer
// @route     PUT /api/queries/answer/:id
// @access    Volunteer
exports.addAnswer = asyncHandler(async (req, res, next) => {
  const query = await Query.findByIdAndUpdate(req.params.id, req.body, {
    returnOriginal: false,
  });
  res.status(200).json({
    success: true,
    data: query,
  });
});

// @desc      Get single query
// @route     GET /api/queries/:id
// @access    Private
exports.getQuery = asyncHandler(async (req, res, next) => {
  const query = await Query.findById(req.params.id);
  if (!query) return next(new ErrorResponse(404, 'Query not found'));
  res.status(200).json({
    success: true,
    data: query,
  });
  next();
});

// @desc      Create query
// @route     POST /api/queries
// @access    Private
exports.createQuery = asyncHandler(async (req, res, next) => {
  const query = await Query.create(req.body);
  if (!query) return next(new ErrorResponse(401, 'Error posting query'));
  res.status(201).json({
    success: true,
    data: query,
  });
  next();
});

// @desc      Update query
// @route     PUT /api/queries/:id
// @access    Private/Admin
exports.updateQuery = asyncHandler(async (req, res, next) => {
  const query = await Query.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: query,
  });
  next();
});
