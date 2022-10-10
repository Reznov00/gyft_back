const mongoose = require('mongoose');
const geocoder = require('geocoder');

const ItemSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter a title for the item'],
  },
  description: {
    type: String,
    required: [true, 'Please enter a description for the item'],
  },
  image: {
    type: String,
    required: [true, 'Please add an image for the item'],
  },
  address: {
    type: String,
    required: [true, 'Please enter an address'],
  },
  phone: {
    type: String,
    required: [true, 'Please enter a phone number for the item'],
  },
  user: { type: String },
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
