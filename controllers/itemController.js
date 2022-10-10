const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Item = require('../models/Item');

// @desc      Get all items
// @route     GET /api/admin/items
// @access    Admin
exports.getItems_Admin = asyncHandler(async (req, res, next) => {
  const items = await Item.find();
  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
});

// @desc      Get all items
// @route     GET /api/items/:lat/:lon/:distance
// @access    Private
exports.getItems = asyncHandler(async (req, res, next) => {
  const { lon, lat, distance } = req.params;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963.2 mi / 6,378 km
  const radius = distance / 3963.2;

  const items = await Item.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lon, lat], radius],
      },
    },
  });

  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
});

// @desc      Get single item
// @route     GET /api/items/:id
// @access    Private/Admin
exports.getItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if (!item) return next(new ErrorResponse(404, 'Item not found'));
  res.status(200).json({
    success: true,
    data: item,
  });
});

// @desc      Create item
// @route     POST /api/items
// @access    Private
exports.createItem = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const item = await Item.create(req.body);
  if (!item) return next(new ErrorResponse(401, 'Error posting item'));
  res.status(200).json({
    success: true,
    data: item,
  });
});

// @desc      Update item
// @route     PUT /api/items/:id
// @access    Private/Admin
exports.updateItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: item,
  });
});

// @desc      Delete item
// @route     DELETE /api/items/:id
// @access    Private/Admin
exports.deleteItem = asyncHandler(async (req, res, next) => {
  const bootcamp = await Item.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
  });
});
