const express = require('express');
const router = express.Router();

router.use('/vote', require('./vote'));
router.use('/health', require('./health'));

module.exports = router;
