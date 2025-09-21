// /backend/src/zk/verifier.js
const fs = require('fs');
const path = require('path');
const semaphoreProof = require('@semaphore-protocol/proof');
const { logger } = require('../utils/logger');

// This module exposes a function to verify a Semaphore proof server-side.
// The library API might differ según versión; aquí usamos pluma general.

async function verifySemaphoreProof({ proof, publicSignals, merkleRoot, externalNullifier }) {
  // publicSignals typical layout for Semaphore: [ signalHash, nullifierHash, root ]
  // But libraries vary; adapt according to the library you installed.
  try {
    // If semaphoreProof.verifyProof exists:
    const vkPath = path.resolve(__dirname, '..', '..', 'zk', 'semaphore_verification_key.json');
    const vk = JSON.parse(fs.readFileSync(vkPath, 'utf8'));
    const res = await semaphoreProof.verifyProof(vk, publicSignals, proof);
    return res === true;
  } catch (err) {
    logger.error('Error verifying Semaphore proof', err);
    return false;
  }
}

module.exports = { verifySemaphoreProof };
