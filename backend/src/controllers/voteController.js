// /backend/src/controllers/voteController.js
const { verifySemaphoreProof } = require('../zk/verifier');
const maci = require('../services/maciCoordinator');
const db = require('../db');
const { logger } = require('../utils/logger');

/**
 * semaphoreSubmit:
 * Body:
 * {
 *   pollId: string,
 *   proof: { ... },           // semaphore proof object
 *   publicSignals: [...],
 *   message: { option: 'A', identityCommitment: '...', ... }
 * }
 */
async function semaphoreSubmit(req, res, next) {
  try {
    const { pollId, proof, publicSignals, message } = req.body;
    if (!pollId || !proof || !publicSignals || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // 1) Verify semaphore proof
    const ok = await verifySemaphoreProof({ proof, publicSignals });
    if (!ok) {
      return res.status(400).json({ error: 'Invalid Semaphore proof' });
    }

    // 2) The client passes identityCommitment inside message (or you can derive from publicSignals)
    const identityCommitment = message.identityCommitment;
    if (!identityCommitment) return res.status(400).json({ error: 'Missing identityCommitment in message' });

    // 3) Pass message to MACI coordinator to process (ensures nullifier/one-vote-per-identity)
    try {
      const r = await maci.processMessage({ pollId, identityCommitment, message });
      return res.status(201).json({ status: 'accepted', id: r.id });
    } catch (err) {
      return res.status(409).json({ error: err.message });
    }
  } catch (err) {
    next(err);
  }
}

async function getGroupInfo(req, res, next) {
  try {
    // For the frontend proof generation we need to provide group leaves and merkle root.
    // For MVP, return leaves from DB (identity commitments recorded) and a mock root.
    const pollId = req.query.pollId || 'poll-1';

    // Query DB for group of allowed identity commitments — for a real system this will be the voter registry.
    const result = await db.query(`SELECT identity_commitment FROM voter_registry WHERE poll_id = $1`, [pollId]);
    const leaves = result.rows.map(r => r.identity_commitment);

    // For convenience compute a simple merkle root placeholder (in production compute real merkle root)
    const merkleRoot = leaves.length ? require('crypto').createHash('sha256').update(leaves.join('|')).digest('hex') : '0';

    res.json({
      pollId,
      merkleRoot,
      depth: 16,
      leaves,
      externalNullifier: 1,
      groupId: pollId
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { semaphoreSubmit, getGroupInfo };
