const { ethers } = require('ethers');
const config = require('../config');
const db = require('../db');
const { logger } = require('../utils/logger');

const ABI = [
  // minimal subset of NoDoAnchor ABI (anchorVoteBatch)
  "function anchorVoteBatch(bytes proof, uint256[] pubSignals, bytes32 root, bytes32 batchHash, string calldata metadata) external",
  "event VoteAnchored(bytes32 indexed root, bytes32 indexed batchHash, string metadata, address indexed submitter, uint256 blockNumber, uint256 timestamp)"
];

let provider, wallet, contract;

function init() {
  provider = new ethers.JsonRpcProvider(config.RPC_URL);
  wallet = new ethers.Wallet(config.PRIVATE_KEY || '0x0', provider);
  contract = new ethers.Contract(config.NODOANCHOR_ADDRESS, ABI, wallet);
  logger.info('AnchorService initialized');
}

async function anchorBatch({ root, batchHash, metadata, proofBytes = '0x', pubSignals = [] }) {
  if (!contract) throw new Error('AnchorService not initialized');
  // For testnets and dev, we can call with empty proof if verifier optional
  logger.info({ root, batchHash }, 'Anchoring batch to chain...');
  try {
    const tx = await contract.anchorVoteBatch(proofBytes, pubSignals, root, batchHash, metadata, { gasLimit: 2_000_000 });
    logger.info({ txHash: tx.hash }, 'Anchor submitted, waiting confirmation...');
    const receipt = await tx.wait();
    logger.info({ txHash: tx.hash, blockNumber: receipt.blockNumber }, 'Anchor confirmed');

    // Persist anchor info to DB
    const insert = `INSERT INTO batches(batch_hash, root, metadata, tx_hash, anchored_at) VALUES($1,$2,$3,$4,$5)
                    ON CONFLICT (batch_hash) DO NOTHING`;
    await db.query(insert, [batchHash, root, metadata, tx.hash, new Date()]);

    return { txHash: tx.hash, receipt };
  } catch (err) {
    logger.error('Error anchoring batch', err);
    throw err;
  }
}

module.exports = { init, anchorBatch };
