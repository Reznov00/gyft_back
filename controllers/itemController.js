const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Item = require('../models/Item');
const User = require('../models/User');

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
  next();
});

// @desc      Get all items
// @route     GET /api/items/:user/:lat/:lon/:distance
// @access    Private
exports.getItems = asyncHandler(async (req, res, next) => {
  const { lon, lat, distance, user } = req.params;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963.2 mi / 6,378 km
  const radius = distance / 3963.2;

  const items = await Item.find({
    $and: [
      {
        location: {
          $geoWithin: {
            $centerSphere: [[lon, lat], radius],
          },
        },
      },
      { user: { $ne: user } },
    ],
  });

  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
  next();
});

// @desc      Get all items posted by one user
// @route     GET /api/items/:user
// @access    Private
exports.getItemsPostedByUser = asyncHandler(async (req, res, next) => {
  const { user } = req.params;

  console.log(user);

  const items = await Item.find({ user: user });

  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
  next();
});

// @desc      Get all items posted by one user
// @route     GET /api/items/:id/requests
// @access    Private
exports.getRequests = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let users = [];
  const item = await Item.findById(id);

  await Promise.all(
    item.interested.map(async (id) => {
      const user = await User.findById(id);
      await users.push(user);
    })
  );

  if (users.length != 0) {
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  }

  return res.status(200).json({
    success: true,
    msg: 'No requests found!',
  });
  next();
});

// @desc      Get single item
// @route     GET /api/items/:id
// @access    Private/Admin
exports.getItem = asyncHandler(async (req, res, next) => {
  console.log('Finding item');
  const item = await Item.findById(req.params.id);
  if (!item) return next(new ErrorResponse(404, 'Item not found'));
  res.status(200).json({
    success: true,
    data: item,
  });
  next();
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
  next();
});

// @desc      Update item
// @route     PUT /api/items/:id
// @access    Private/Admin
exports.updateItem = asyncHandler(async (req, res, next) => {
  console.log('In update');
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: item,
  });
  next();
});

// @desc      Add Interested User
// @route     PUT /api/items/:id/add
// @access    Private/Admin
exports.addInterestedUser = asyncHandler(async (req, res, next) => {
  const { id } = await req.params;
  const { user } = await req.body;
  const item = await Item.findByIdAndUpdate(id, {
    $addToSet: { interested: user },
  });
  res.status(200).json({
    success: true,
    data: 'Request Sent Successfully',
  });
  next();
});

// @desc      Delete Interested User
// @route     PUT /api/items/:id/remove
// @access    Private/Admin
exports.deleteInterestedUser = asyncHandler(async (req, res, next) => {
  const { id } = await req.params;
  const { user } = await req.body;
  console.log(id, user);
  const item = await Item.findByIdAndUpdate(id, {
    $pull: { interested: user },
  });
  res.status(200).json({
    success: true,
    data: 'Request Sent Successfully',
  });
  next();
});

// @desc      Add Interested User
// @route     PUT /api/items/:id/approve
// @access    Private/Admin
exports.addApprovedUser = asyncHandler(async (req, res, next) => {
  const { id } = await req.params;
  const { user } = await req.body;
  console.log(user, id);
  const item = await Item.findByIdAndUpdate(id, {
    $addToSet: { approved: user },
  });
  res.status(200).json({
    success: true,
    data: 'User Approved!',
  });
  next();
});

// @desc      Delete item
// @route     DELETE /api/items/:id
// @access    Private/Admin
exports.deleteItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
  });
  next();
});
