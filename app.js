const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./utils/config');
const middleware = require('./utils/middleware');

const app = express();
const logger = require('./utils/logger');
const shortenersRouter = require('./controller/shorteners');

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('connected to MongoDB'))
  .catch((err) => logger.error(err.message));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', async (req, res) => {
  res.redirect('https://maxima.umn.ac.id');
});
/* router placed below */
app.use('/api/shorteners', shortenersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
