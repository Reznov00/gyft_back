const mongoose = require('mongoose');
const user = require('./User');
const UserSchema = user.Schema;
const VolunteerSchema = mongoose.Schema({
  applicant: UserSchema,
  exp: { type: Number, required: true },
  specialization: { type: String, required: true },
  category: { type: String, required: true },
  proof: { type: String, required: true },
});

module.exports = new mongoose.model('Volunteer', VolunteerSchema);
