// Script Node.js para generar witness y prueba (usa snarkjs)
// Requiere: npm i snarkjs fs-extra


const snarkjs = require('snarkjs');
const fs = require('fs');


async function run() {
const INPUT = JSON.parse(fs.readFileSync('inputs/example_input.json'));
const wasmPath = 'build/membership_js/membership.wasm';
const zkeyPath = 'build/membership_final.zkey';


console.log('Generando witness...');
const {wtns} = await snarkjs.wtns.calculate(INPUT, wasmPath);
// Nota: la API de snarkjs en Node puede variar; en la práctica se usa snarkjs.wtns.calculate
// y luego snarkjs.plonk.prove


console.log('Generando prueba PLONK...');
const {proof, publicSignals} = await snarkjs.plonk.prove(zkeyPath, wasmPath, INPUT);


fs.writeFileSync('build/proof.json', JSON.stringify(proof, null, 2));
fs.writeFileSync('build/publicSignals.json', JSON.stringify(publicSignals, null, 2));


console.log('Prueba y señales públicas guardadas en build/');
}


run().catch(console.error);