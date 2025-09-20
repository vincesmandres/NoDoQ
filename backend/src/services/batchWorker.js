/**
 * batchWorker: se ejecuta como proceso (docker compose puede ejecutar npm run anchor-runner)
 * - revisa las colas `votequeue:{pollId}` en Redis
 * - si hay >= BATCH_MIN_VOTES o edad > BATCH_MAX_AGE_SECONDS -> crea batchHash + root (simple merkle or aggregate)
 * - sube batch a IPFS (no implementado aquí; devolvemos metadata placeholder)
 * - llama anchorService.anchorBatch(...)
 *
 * Nota: para simplificar en este ejemplo no incluimos IPFS client, pero marcamos el lugar para integrar.
 */

const redis = require('../redis');
const config = require('../config');
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const anchorService = require('./anchorService');
const { logger } = require('../utils/logger');

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function drainQueue(pollId, maxItems) {
  const key = `votequeue:${pollId}`;
  const items = [];
  for (let i = 0; i < maxItems; i++) {
    const item = await redis.lpop(key);
    if (!item) break;
    items.push(JSON.parse(item));
  }
  return items;
}

async function getActivePolls() {
  // For this example, we look for all keys votequeue:* (Redis SCAN)
  const keys = [];
  let cursor = '0';
  do {
    const reply = await redis.scan(cursor, 'MATCH', 'votequeue:*', 'COUNT', 100);
    cursor = reply[0];
    const found = reply[1];
    keys.push(...found);
  } while (cursor !== '0');
  // extract pollIds
  return keys.map(k => k.split(':')[1]);
}

function computeBatchHash(items) {
  // Simplified: compute a SHA256 over concatenated vote ids (in prod: Merkle root + IPFS cid)
  const crypto = require('crypto');
  const h = crypto.createHash('sha256');
  for (const i of items) {
    h.update(i.id + '|' + i.nullifier);
  }
  return '0x' + h.digest('hex');
}

async function processPoll(pollId) {
  const queueKey = `votequeue:${pollId}`;
  const length = await redis.llen(queueKey);
  if (length === 0) return;

  if (length >= config.BATCH_MIN_VOTES) {
    // Drain up to BATCH_MIN_VOTES
    const items = await drainQueue(pollId, config.BATCH_MIN_VOTES);
    if (items.length === 0) return;

    const batchHash = computeBatchHash(items);
    const root = items[0].root || '0x0';

    // TODO: Upload batch content and proofs to IPFS and set metadata = ipfs://CID
    const metadata = `dev-batch:${uuidv4()}`;

    // call anchor
    try {
      const res = await anchorService.anchorBatch({ root, batchHash, metadata });
      logger.info({ pollId, batchHash, tx: res.txHash }, 'Batch anchored');
      // mark votes as batched in DB
      const ids = items.map(i => i.id);
      const q = `UPDATE votes SET batched = true, batch_hash = $1 WHERE id = ANY($2::text[])`;
      await db.query(q, [batchHash, ids]);
    } catch (err) {
      logger.error('Failed anchoring batch', err);
      // On failure, push items back to queue
      for (const it of items) {
        await redis.lpush(queueKey, JSON.stringify(it));
      }
    }
  }
}

async function loop() {
  logger.info('Batch worker started');
  anchorService.init();
  while (true) {
    try {
      const polls = await getActivePolls();
      for (const pollId of polls) {
        await processPoll(pollId);
      }
    } catch (err) {
      logger.error('Batch worker error', err);
    }
    await sleep(5000);
  }
}

// Run if executed directly
if (require.main === module) {
  loop().catch(err => {
    console.error('Batch worker crashed', err);
    process.exit(1);
  });
}

module.exports = { loop };
