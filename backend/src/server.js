require('dotenv').config();
const maci = require('./services/maciCoordinator');
const app = require('./app');
const { logger } = require('./utils/logger');
const config = require('./config');

const PORT = config.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`NoDo backend listening on port ${PORT}`);
});

maci.initTables().then(() => {
  logger.info('MACI tables ready');
}).catch(err => {
  logger.error('Error initializing MACI tables', err);
});
