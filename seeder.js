const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

const User = require('./models/User');
const Item = require('./models/Item');
const Request = require('./models/Request');

dotenv.config({ path: './config/config.env' });

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  dbName: 'gyft',
});

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_dummydata/users.json`, 'utf-8')
);
const items = JSON.parse(
  fs.readFileSync(`${__dirname}/_dummydata/items.json`, 'utf-8')
);
const requests = JSON.parse(
  fs.readFileSync(`${__dirname}/_dummydata/requests.json`, 'utf-8')
);

const importData = async () => {
  try {
    await User.create(users);
    await Item.create(items);
    await Request.create(requests);
    console.log('Data Added...'.green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Item.deleteMany();
    await Request.deleteMany();
    console.log('Data Deleted...'.red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

process.argv[2] === '-i' ? importData() : deleteData();
