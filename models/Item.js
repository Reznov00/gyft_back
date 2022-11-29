const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  interested: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  approved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
  },
});

module.exports = new mongoose.model('Items', ItemSchema);
