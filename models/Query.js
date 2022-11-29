const mongoose = require('mongoose');
const user = require('./User');
const UserSchema = user.Schema;

const QuerySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  postedBy: UserSchema,
  answer: { type: String },
  answeredBy: UserSchema,
  // postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // answer: {
  //   type: String,
  //   answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // },
});

module.exports = new mongoose.model('Query', QuerySchema);
