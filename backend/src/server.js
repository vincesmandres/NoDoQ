require('dotenv').config();
const app = require('./app');
const { logger } = require('./utils/logger');
const config = require('./config');

const PORT = config.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`NoDo backend listening on port ${PORT}`);
});
