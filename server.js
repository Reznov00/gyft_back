const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');
// const fileUpload = require('express-fileupload')

//Importing dotenv variables
dotenv.config({ path: './config/config.env' });

//Import Routes
const users = require('./routes/userRoutes');
const items = require('./routes/itemRoutes');
const requests = require('./routes/requestRoutes');
const queries = require('./routes/queryRoutes');

//Initialize Express App
const app = express();

//Function call to connect to Database
connectDB();

app.get('/', (req, res) => res.send('Welcome to GYFT API'));

// app.use(fileUpload())
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(express.static('public'));

// Registering Routes to the Express App
app.use('/api/users', users);
app.use('/api/items', items);
app.use('/api/requests', requests);
app.use('/api/queries', queries);

app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server started on port ${PORT}`.bold.yellow)
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
