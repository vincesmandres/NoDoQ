// /backend/src/routes/vote.js
const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');

// New endpoint for Semaphore + MACI flow
router.post('/semaphore-submit', voteController.semaphoreSubmit);

// Optional: for client to obtain group info for proof generation
router.get('/get-group', voteController.getGroupInfo);

module.exports = router;
