const Redis = require('ioredis');
const config = require('./config');
const redis = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT
});

redis.on('error', (err) => {
  console.error('Redis error', err);
});

module.exports = redis;
