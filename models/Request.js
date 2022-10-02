const mongoose = require('mongoose');

const RequestSchema = mongoose.Schema({
    title:{
        type: String,
        required: [true,'Please enter a title for the item']
    },
    description:{
        type: String,
        required: [true,'Please enter a description for the item'],
    },
});

module.exports = mongoose.model('Request', RequestSchema);