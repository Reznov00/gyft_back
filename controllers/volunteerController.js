const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const user = require('../models/User');
const User = user.Model;
const Volunteer = require('../models/Volunteer');

// @desc      Get all volunteers
// @route     GET /api/users/volunteers
// @access    Admin
exports.getVolunteers = asyncHandler(async (req, res, next) => {
  const vol = await Volunteer.find();
  res.status(200).json({
    success: true,
    count: vol.length,
    data: vol,
  });
});

// @desc      Approve volunteers
// @route     PATCH /api/volunteers/approve/:id
// @access    Admin
exports.approveVolunteer = asyncHandler(async (req, res, next) => {
  const vol = await Volunteer.findById(req.params.id);
  const updated = await User.findByIdAndUpdate(
    vol.applicant._id,
    {
      'volunteer.status': true,
    },
    { returnOriginal: false }
  ).then(async () => {
    await Volunteer.findByIdAndDelete(req.params.id);
  });
  res.status(200).json({
    success: true,
    data: updated,
  });
});
