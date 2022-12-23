const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const user = require('../models/User');
const User = user.Model;
const Item = require('../models/Item');
const Volunteer = require('../models/Volunteer');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

/*
200 --- OK! 
400 --- User End 
500 --- Server/App End
*/

// @desc      Get all users
// @route     GET /api/users
// @access    Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc      Get single user
// @route     GET /api/users/:id
// @access    Private
exports.getLoggedUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return next(new ErrorResponse(404, 'User not found'));
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Get single user/Login user
// @route     GET /api/users/:email/:password
// @access    Private
exports.getUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.params;
  if (!email || !password)
    return next(new ErrorResponse(403, 'Fields missing'));
  const user = await User.findOne({ email });
  if (!user) return next(new ErrorResponse(404, 'User not found'));
  console.log(password, '\n', user.password);
  await bcrypt.compare(password, user.password, (err, same) => {
    if (err) return next(new ErrorResponse(500, 'Failed to compare password'));
    if (same) {
      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      return next(new ErrorResponse(401, 'Passwords do not match'));
    }
  });
  // res.status(200).json({
  //   success: true,
  //   data: user,
  // });
});

// @desc      Create user
// @route     POST /api/users
// @access    Private
exports.createUser = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const { password } = req.body;
  if (!password) return next(new ErrorResponse(400, 'Fields missing'));
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

// @desc      Create user
// @route     POST /api/users/verify
// @access    Private
exports.verifyUser = asyncHandler(async (req, res, next) => {
  const user = await User.find({ email: req.body.email });
  if (user.length > 0) {
    res.status(403).json({
      error: true,
      msg: 'User already exists',
    });
    // return next(new ErrorResponse(403, 'User Already Registered'));
  } else {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    var OTP = Math.floor(100000 + Math.random() * 100001);
    var mailOptions = {
      from: process.env.MAIL_SENDER,
      to: req.body.email,
      subject: 'Verify User',
      text: `Hello, ${req.body.name}! Your OTP is ${OTP}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(404).json({
          error,
        });
      } else {
        res.status(200).json({
          OTP,
        });
      }
    });
  }
});

// @desc      Add an interested item
// @route     PUT /api/users/:user/add
// @access    Private
exports.addInterestingItem = asyncHandler(async (req, res, next) => {
  const { user } = await req.params;
  const { item } = await req.body;
  console.log('Adding to requests');
  const respo = await User.findByIdAndUpdate(
    user,
    {
      $addToSet: { requests: item },
    },
    { returnOriginal: false }
  );
  console.log(respo);
  res.status(200).json({
    success: true,
    data: respo,
  });
});

// @desc      Delete an interested item
// @route     PUT /api/users/:id/remove
// @access    Private
exports.deleteInterestingItem = asyncHandler(async (req, res, next) => {
  const { user } = await req.params;
  const { item } = await req.body;
  console.log(item, user);
  const respo = await User.findByIdAndUpdate(id, {
    $pull: { requests: item },
  });
  res.status(200).json({
    success: true,
  });
  next();
});

// @desc      Get the sent requests
// @route     POST /api/users/:id/requests
// @access    Private
exports.getRequests = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  let items = [];
  await Promise.all(
    user.requests.map(async (id) => {
      const item = await Item.findById(id);
      item !== null && (await items.push(item));
    })
  );
  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
});

// @desc      Apply as Volunteer
// @route     PATCH /api/users/apply/:id
// @access    Private
exports.applyAsVolunteer = asyncHandler(async (req, res, next) => {
  const userID = req.params.id;
  const vol = await Volunteer.create(req.body);
  if (!vol)
    return next(new ErrorResponse(401, 'Error while registering volunteer'));
  const user = await User.findByIdAndUpdate(
    userID,
    {
      $set: {
        'volunteer.applied': true,
        'volunteer.category': req.body.category,
      },
    },
    { returnOriginal: false }
  );
  res.status(200).json({
    success: true,
    data: user,
  });
  next();
});

// @desc      Change Application Status
// @route     POST /api/users/applied/:id
// @access    Private
exports.changeApplicationStatus = asyncHandler(async (req, res, next) => {
  const userID = req.params.id;
  const user = await User.findByIdAndUpdate(userID, {
    $set: {
      'volunteer.applied': true,
    },
  });
  res.status(200).json({
    success: true,
    data: user,
  });
  next();
});

// @desc      Update user
// @route     PUT /api/users/change/:id
// @access    Private
exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.new, salt);
  await bcrypt.compare(req.body.old, user.password, async (err, same) => {
    if (err) return next(new ErrorResponse(500, 'Failed to compare password'));
    if (same) {
      const newUser = await User.findByIdAndUpdate(
        user.id,
        {
          password: password,
        },
        { returnOriginal: false }
      );
      console.log(user.password, newUser.password);
    } else {
      res.status(404).json({
        error: true,
        msg: 'Wrong password entered',
      });
    }
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update user
// @route     PUT /api/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Delete user
// @route     DELETE /api/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
  });
});
