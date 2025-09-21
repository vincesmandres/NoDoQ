// /backend/src/services/maciCoordinator.js
const crypto = require('crypto');
const db = require('../db');
const redis = require('../redis');
const { logger } = require('../utils/logger');
const EthCrypto = require('eth-crypto');
const base64url = require('base64url');

/**
 * Simplified MACI Coordinator (MVP)
 *
 * Responsibilities:
 * - Receive a 'message' from a voter (already validated by Semaphore proof).
 * - Ensure message nullifier / identity commitment not reused (prevent double vote).
 * - Decrypt message payload if encrypted (for MVP we accept plaintext message).
 * - Apply to tally in Postgres (table `maci_votes`).
 *
 * NOTE: This is intentionally simplified. Real MACI:
 * - Uses voice credits, encrypted messages, batch processing and a smart contract.
 * - Requires coordinator private key to decrypt messages; coordinator is trusted in JS MVP.
 */

// Initialize coordinator key (for MVP we generate or use env)
const COORD_PRIVATE_KEY = process.env.MACI_COORD_PRIVATE_KEY || crypto.randomBytes(32).toString('hex');
const COORD_PUBLIC_KEY = EthCrypto.publicKeyByPrivateKey(COORD_PRIVATE_KEY);

async function initTables() {
  // Create a table for maci_votes
  const q = `
  CREATE TABLE IF NOT EXISTS maci_votes (
    id SERIAL PRIMARY KEY,
    poll_id TEXT NOT NULL,
    identity_commitment TEXT NOT NULL,
    nullifier_hash TEXT,
    option TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_maci_unique_identity_poll ON maci_votes (poll_id, identity_commitment);
  `;
  await db.query(q);
}

async function processMessage({ pollId, identityCommitment, message }) {
  // message: { option, ... }
  // nullifier: derive from identityCommitment + pollId (MVP)
  const nullifier = deriveNullifier(identityCommitment, pollId);

  // Check redis set nullifiers:<pollId>
  const key = `maci:nullifiers:${pollId}`;
  const exists = await redis.sismember(key, nullifier);
  if (exists) {
    throw new Error('Nullifier already used — probable double vote');
  }

  // Insert into DB (this prevents replay at DB level due to unique index)
  try {
    const insert = `INSERT INTO maci_votes (poll_id, identity_commitment, nullifier_hash, option) VALUES ($1,$2,$3,$4) RETURNING id, created_at`;
    const values = [pollId, identityCommitment, nullifier, message.option];
    const res = await db.query(insert, values);
    // mark nullifier in Redis
    await redis.sadd(key, nullifier);
    return { ok: true, id: res.rows[0].id };
  } catch (err) {
    // if unique violation -> duplicate
    throw new Error('Failed to record vote: ' + err.message);
  }
}

function deriveNullifier(identityCommitment, pollId) {
  // Simple deterministic nullifier for MVP
  const h = crypto.createHash('sha256');
  h.update(identityCommitment + '|' + pollId);
  return h.digest('hex');
}

async function getTally(pollId) {
  const q = `SELECT option, count(*) as cnt FROM maci_votes WHERE poll_id = $1 GROUP BY option`;
  const res = await db.query(q, [pollId]);
  return res.rows;
}

module.exports = { initTables, processMessage, getTally, COORD_PUBLIC_KEY, COORD_PRIVATE_KEY };
