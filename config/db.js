const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI,{
        useUnifiedTopology: true,
        useNewUrlParser: true,
        dbName: 'gyft'
    });

    console.log('MongoDB Connected'.bold.underline.cyan);
}

module.exports = connectDB;