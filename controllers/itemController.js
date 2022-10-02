const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Item = require('../models/Item');

// @desc      Get all items
// @route     GET /api/admin/items
// @access    Admin
exports.getItems_Admin = asyncHandler( async (req, res, next) => {
  const items = await Item.find();
  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
});

// @desc      Get all items
// @route     GET /api/items/:lat/:lon/:distance
// @access    Private
exports.getItems = asyncHandler( async (req, res, next) => {
  const { lat, lon, distance } = req.params;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const items = await Item.find({
    location: { $geoWithin: { $centerSphere: [[lon, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
});

// @desc      Get single item
// @route     GET /api/items/:id
// @access    Private/Admin
exports.getItem = asyncHandler( async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if(!item) return next(new ErrorResponse(404,'Item not found'));
  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc      Create item
// @route     POST /api/items
// @access    Private
exports.createItem = asyncHandler( async (req, res, next) => {
  console.log(req.body);
  const item = await Item.create(req.body);
  if(!item) return next(new ErrorResponse(401, 'Error posting item'));
  res.status(200).json({
    success: true,
    data: item
  });
});


// ============== Purana Wala ================

// @desc      Create item
// @route     POST /api/items
// @access    Private
// exports.createItem = asyncHandler( async (req, res, next) => {
//   console.log('asdfasdfa');
//   const file = req.file;
//   if (!file) return res.status(400).send('No image in the request');

//   const fileName = file.filename;
//   // await imgbbUploader('383a836511c9b1ae98e599a5625f20cd',file)
//   //         .then(res => console.log(res));

//   /*
//   const file = req.files;
//   console.log(file.mimetype.substring(file.mimetype.lastIndexOf('/') + 1));
//   if (!file) return next(new ErrorResponse(400, 'Missing file'));
//   if(!file.mimetype.startsWith('image')) return next(new ErrorResponse(400, 'Please upload an image file'));
  
//   if(file.size < process.env.MAX_FILE_SIZE) return next(new ErrorResponse(400, `File size must be smaller then ${process.env.MAX_FILE_SIZE}`));
//   console.log(file);
//   file.filename = `image_${Date.now()}.${file.mimetype.substring(file.mimetype.lastIndexOf('/') + 1)}`;
//   console.log(file.filename);

//   file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
//     if(err) return next(new ErrorResponse(500, `Error uploading image: ${err.message}`));
//     await imgbbUploader("383a836511c9b1ae98e599a5625f20cd", `${process.env.FILE_UPLOAD_PATH}/${file.name}`)
//       .then(response => {
//         // fs.unlinkSync(`${process.env.FILE_UPLOAD_PATH}/${file.name}`)
//         req.body.image = response.url;
//       })
//       .catch(error => console.error(error));
//   */

//   // const item = await Item.create(req.body);

//   // res.status(201).json({
//   //   success: true,
//   //   data: item
//   // });
// // });
// });

// @desc      Update item
// @route     PUT /api/items/:id
// @access    Private/Admin
exports.updateItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc      Delete item
// @route     DELETE /api/items/:id
// @access    Private/Admin
exports.deleteItem = asyncHandler(async (req, res, next) => {
  const bootcamp = await Item.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true
  });
});