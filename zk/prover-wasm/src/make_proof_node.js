// Script de uso en node.js (no navegador) para generar una prueba usando snarkjs y los artefactos locales
// Uso: node scripts/make_proof_node.js path/to/input.json


const snarkjs = require('snarkjs');
const fs = require('fs');
const path = require('path');


async function main() {
const argv = process.argv.slice(2);
if (argv.length < 1) {
console.error('Usage: node make_proof_node.js inputs/example_input.json');
process.exit(1);
}
const inputPath = argv[0];
const input = JSON.parse(fs.readFileSync(inputPath));


const wasmPath = path.resolve(__dirname, '..', 'public', 'membership_js', 'membership.wasm');
const zkeyPath = path.resolve(__dirname, '..', 'public', 'membership_final.zkey');


if (!fs.existsSync(wasmPath) || !fs.existsSync(zkeyPath)) {
console.error('WASM o ZKEY no encontrados. Ejecuta `node scripts/copy-artifacts.js` primero.');
process.exit(1);
}


console.log('Generando proof con snarkjs.plonk.fullProve...');
const res = await snarkjs.plonk.fullProve(input, wasmPath, zkeyPath);
fs.writeFileSync(path.resolve(__dirname, '..', 'public', 'proof.json'), JSON.stringify(res.proof, null, 2));
fs.writeFileSync(path.resolve(__dirname, '..', 'public', 'publicSignals.json'), JSON.stringify(res.publicSignals, null, 2));
console.log('Proof generado en public/proof.json');
}


main().catch(err => { console.error(err); process.exit(1); });