const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// @desc      Get all users
// @route     GET /api/users
// @access    Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc      Get single user
// @route     GET /api/users/:email/:password
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const {email,password} = req.params;
  if(!email || !password) return next(new ErrorResponse(400, 'Fields missing'));
  const user = await User.find({email: email});
  if(!user) return next(new ErrorResponse(404, 'User not found'));
  console.log(password.blue.bold,user[0].password.green.bold);
  await bcrypt.compare(password, user[0].password, (err,same)=>{
    if(err) return next(new ErrorResponse(500, 'Failed to compare password'));
    if(same){
      res.status(200).json({
        success: true,
        data: user
      })
    }else{
      return next(new ErrorResponse(401, 'Passwords do not match'));
    }
  });
});

// @desc      Create user
// @route     POST /api/users
// @access    Private
exports.createUser = asyncHandler(async (req, res, next) => {
  console.log(req.body)
  const {password} = req.body;
  if(!password) return next(new ErrorResponse(400, 'Fields missing'));
  
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc      Update user
// @route     PUT /api/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Delete user
// @route     DELETE /api/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true
  });
});