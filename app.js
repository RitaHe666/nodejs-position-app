const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan')
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const positionRoutes = require('./routes/position');
const userRoutes = require('./routes/user');

try {
  dotenv.config();
  const userName = process.env.MONGO_ATLAS_USER_NAME;
  const password = process.env.MONGO_ATLAS_PASSWORD;
  const uri = `mongodb+srv://${userName}:${password}@cluster0.nzwmthw.mongodb.net/nodejs-opening?retryWrites=true&w=majority`;
  mongoose.connect(uri);
  mongoose.Promise = global.Promise;
} catch(err) {
  console.error(err);
}

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use('/api/position', positionRoutes);
app.use('/api/user', userRoutes);
app.use(errorHandler.notFoundHandler);
app.use(errorHandler.commonErrorHandler);

module.exports = app;