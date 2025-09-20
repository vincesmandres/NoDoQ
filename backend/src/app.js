const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const routes = require('./routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json({ limit: '2mb' }));

app.use('/api', routes);

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
