const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const router = require('./routes');
require('dotenv').config();

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cookieParser());
app.use('/api', router);

module.exports = app;
