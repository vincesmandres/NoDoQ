const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');

/**
 * POST /api/vote/submit
 * Body: {
 *   root: string (hex decimal string or numeric string),
 *   nullifier: string,
 *   proof: object OR base64/hex bytes,
 *   publicSignals: array,
 *   pollId: string,
 *   encryptedVote: string (opaque ciphertext)
 * }
 */
router.post('/submit', voteController.submitVote);

module.exports = router;
