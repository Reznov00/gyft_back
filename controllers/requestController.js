const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Request = require('../models/Request');

// @desc      Get all requests
// @route     GET /api/requests
// @access    Admin
exports.getRequests_Admin = asyncHandler(async (req, res, next) => {
  const requests = await Request.find();
  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests,
  });
});

// @desc      Get all requests
// @route     GET /api/requests/:lat/:lon/:distance
// @access    Private
exports.getRequests = asyncHandler(async (req, res, next) => {
  const { lon, lat, distance, user, category } = req.params;
  console.log(lon, lat, distance, user, category);

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963.2 mi / 6,378 km
  const radius = distance / 3963.2;

  const requests = await Request.find({
    $and: [
      {
        location: {
          $geoWithin: {
            $centerSphere: [[lon, lat], radius],
          },
        },
      },
      { category: { $eq: category } },
      { user: { $ne: user } },
    ],
  });

  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests,
  });
});

// @desc      Get all requests posted by one user
// @route     GET /api/requests/posted/:user
// @access    Private
exports.getRequestsPostedByUser = asyncHandler(async (req, res, next) => {
  const requests = await Request.find({ user: req.params.user });

  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests,
  });
  next();
});

// @desc      Get single request
// @route     GET /api/requests/:id
// @access    Private/Admin
exports.getRequest = asyncHandler(async (req, res, next) => {
  const request = await Request.findById(req.params.id);
  if (!request)
    return next(
      new ErrorResponse(404, `No request found for ${req.params.id}`)
    );
  res.status(200).json({
    success: true,
    data: request,
  });
});

// @desc      Create request
// @route     POST /api/requests
// @access    Private
exports.createRequest = asyncHandler(async (req, res, next) => {
  const request = await Request.create(req.body);
  res.status(201).json({
    success: true,
    data: request,
  });
});

// @desc      Update request
// @route     PATCH /api/requests/:id
// @access    Private/Admin
exports.updateRequest = asyncHandler(async (req, res, next) => {
  const request = await Request.findByIdAndUpdate(req.params.id, req.body, {
    returnOriginal: false,
  });

  res.status(200).json({
    success: true,
    data: request,
  });
  next();
});

// @desc      Delete request
// @route     DELETE /api/requests/:id
// @access    Private/Admin
exports.deleteRequest = asyncHandler(async (req, res, next) => {
  const request = await Request.findByIdAndDelete(req.params.id);
  if (!request)
    return next(
      new ErrorResponse(404, `No request found for ${req.params.id}`)
    );
  res.status(200).json({
    success: true,
  });
});
