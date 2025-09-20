require('dotenv').config();

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  ZKEY_PATH: process.env.ZKEY_PATH,
  VERIFICATION_KEY_JSON: process.env.VERIFICATION_KEY_JSON,
  WASM_PATH: process.env.WASM_PATH,
  RPC_URL: process.env.RPC_URL,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  NODOANCHOR_ADDRESS: process.env.NODOANCHOR_ADDRESS,
  PORT: process.env.PORT || 4000,
  BATCH_MIN_VOTES: Number(process.env.BATCH_MIN_VOTES || 10),
  BATCH_MAX_AGE_SECONDS: Number(process.env.BATCH_MAX_AGE_SECONDS || 300)
};
