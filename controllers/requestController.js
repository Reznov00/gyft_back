const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Request = require('../models/Request');

// @desc      Get all requests
// @route     GET /api/requests
// @access    Private/Admin
exports.getRequests = asyncHandler( async (req, res, next) => {
  const requests = await Request.find();
  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests
  });
});

// @desc      Get single request
// @route     GET /api/requests/:id
// @access    Private/Admin
exports.getRequest = asyncHandler( async (req, res, next) => {
  const request = await Request.findById(req.params.id);
  if(!request) return next(new ErrorResponse(404,`No request found for ${req.params.id}`));
  res.status(200).json({
    success: true,
    data: request
  });
});

// @desc      Create request
// @route     POST /api/requests
// @access    Private
exports.createRequest = asyncHandler(async (req, res, next) => {
  const request = await Request.create(req.body);
  res.status(201).json({
    success: true,
    data: request
  });
});

// @desc      Update request
// @route     PUT /api/requests/:id
// @access    Private/Admin
exports.updateRequest = asyncHandler(async (req, res, next) => {
  const request = await Request.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if(!request) return next(new ErrorResponse(404,`No request found for ${req.params.id}`));
  res.status(200).json({
    success: true,
    data: request
  });
});

// @desc      Delete request
// @route     DELETE /api/requests/:id
// @access    Private/Admin
exports.deleteRequest = asyncHandler(async (req, res, next) => {
  const request = await Request.findByIdAndDelete(req.params.id);
  if(!request) return next(new ErrorResponse(404,`No request found for ${req.params.id}`));
  res.status(200).json({
    success: true
  });
});