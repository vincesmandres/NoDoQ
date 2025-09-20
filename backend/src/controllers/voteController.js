const uuid = require('uuid').v4;
const redis = require('../redis');
const db = require('../db');
const config = require('../config');
const { verifyProof } = require('../zk/verifier');
const { logger } = require('../utils/logger');

/**
 * submitVote: verifies proof off-chain, checks nullifier, persists vote, queues for batch
 */
async function submitVote(req, res, next) {
  try {
    const { root, nullifier, proof, publicSignals, pollId, encryptedVote } = req.body;
    if (!nullifier || !proof || !publicSignals || !pollId || !encryptedVote || !root) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1) Verify the ZK proof using snarkjs (off-chain)
    const valid = await verifyProof({ proof, publicSignals, root });
    if (!valid) {
      return res.status(400).json({ error: 'Invalid proof' });
    }

    // 2) Check nullifier in Redis set for this pollId
    const nullifierKey = `nullifiers:${pollId}`;
    const exists = await redis.sismember(nullifierKey, nullifier);
    if (exists) {
      return res.status(409).json({ error: 'Nullifier already used — duplicate vote' });
    }

    // 3) Mark nullifier (use SADD)
    await redis.sadd(nullifierKey, nullifier);

    // Optionally set a TTL on nullifiers for the poll duration (e.g., 7 days)
    // await redis.expire(nullifierKey, 60*60*24*7);

    // 4) Persist vote in Postgres (store encryptedVote and nullifier)
    const voteId = uuid();
    const now = new Date();
    const insert = `INSERT INTO votes(id, poll_id, nullifier, root, encrypted_vote, created_at)
                    VALUES($1,$2,$3,$4,$5,$6) RETURNING id, created_at`;
    const values = [voteId, pollId, nullifier, root, encryptedVote, now];
    const result = await db.query(insert, values);

    // 5) push into a queue list to be batched (Redis list)
    const queueKey = `votequeue:${pollId}`;
    const queueItem = JSON.stringify({ id: voteId, pollId, nullifier, root, encryptedVote, created_at: now.toISOString() });
    await redis.rpush(queueKey, queueItem);

    logger.info({ voteId, pollId }, 'Vote accepted and queued');

    return res.status(201).json({ status: 'accepted', voteId, created_at: result.rows[0].created_at });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitVote };
