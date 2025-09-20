const { Pool } = require('pg');
const config = require('./config');
const { logger } = require('./utils/logger');

const pool = new Pool({
  connectionString: config.DATABASE_URL
});

pool.on('error', (err) => {
  logger.error('Unexpected PG client error', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
