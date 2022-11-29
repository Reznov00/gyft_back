const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your full name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email address'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [8, 'Password should contain at least 8 characters'],
  },
  cnic: {
    type: String,
    required: [true, 'Please enter your CNIC'],
    // unique: true,
    match: [
      /^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$/,
      'Please enter the CNIC in XXXXX-XXXXXXX-X format',
    ],
  },
  volunteer: {
    applied: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
    category: { type: String },
  },
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
});
// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
const User = new mongoose.model('Users', UserSchema);

module.exports = {
  Schema: UserSchema,
  Model: User,
};
