const snarkjs = require('snarkjs');
const fs = require('fs');
const config = require('../config');
const { logger } = require('../utils/logger');

let verificationKey = null;

// Cargar verification key JSON al iniciar
if (config.VERIFICATION_KEY_JSON) {
  try {
    const vkRaw = fs.readFileSync(config.VERIFICATION_KEY_JSON, 'utf8');
    verificationKey = JSON.parse(vkRaw);
    logger.info('Verification key loaded');
  } catch (err) {
    logger.error('Failed to load verification key:', err.message);
  }
} else {
  logger.warn('VERIFICATION_KEY_JSON not set; verifier will be in disabled mode for development');
}

/**
 * verifyProof: recibe objeto con { proof, publicSignals, root }.
 * - proof: puede ser el objeto `proof` generado por snarkjs fullProve
 * - publicSignals: array de señales públicas (strings)
 *
 * Devuelve true/false.
 */
async function verifyProof({ proof, publicSignals, root }) {
  if (!verificationKey) {
    // En entornos de desarrollo: false (o true?) -> mejor devolver false para mayor seguridad.
    logger.warn('No verification key loaded: rejecting proof (dev mode)');
    return false;
  }

  try {
    // Si el proof viene serializado como string, parsearlo.
    // PLONK verify API: snarkjs.plonk.verify(verificationKey, publicSignals, proof)
    const valid = await snarkjs.plonk.verify(verificationKey, publicSignals, proof);
    return valid;
  } catch (err) {
    logger.error('snarkjs verify error', err);
    return false;
  }
}

module.exports = { verifyProof };
