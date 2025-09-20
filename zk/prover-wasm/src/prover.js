import * as snarkjs from 'snarkjs';
import fs from 'fs';


// Nota: en el navegador no podemos usar 'fs'. Vite permite importar archivos estáticos desde /public.
// Asumimos que los artefactos del circuito están en `/public/membership_js/membership.wasm` y
// `/public/membership_final.zkey`.


const WASM_PATH = '/membership_js/membership.wasm';
const ZKEY_PATH = '/membership_final.zkey';


export async function generateProofFromInputFile(inputJson) {
// snarkjs provides browser APIs that expect fetchable wasm/zkey. Use snarkjs.plonk.fullProve
// which takes (input, wasmPath, zkeyPath) and returns {proof, publicSignals}
if (!snarkjs || !snarkjs.plonk) throw new Error('snarkjs.plonk not available');


const result = await snarkjs.plonk.fullProve(inputJson, WASM_PATH, ZKEY_PATH);
// result = { proof, publicSignals }
return result;
}


// For tooling: expose a method to compute the nullifier locally to show to the user
export async function computeNullifier(secret, epoch, pollId) {
// Poseidon using ffjavascript
const ff = await import('ffjavascript');
const { buildPoseidon } = await import('ffjavascript').then(m => m.poseidon || m);
const poseidon = await buildPoseidon();
const F = poseidon.F;
const nf = poseidon([secret, epoch, pollId]);
return F.toString(nf);
}