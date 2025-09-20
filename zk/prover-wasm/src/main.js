import { generateProofFromInputFile } from './prover.js';


const fileInput = document.getElementById('file');
const btn = document.getElementById('gen');
const out = document.getElementById('output');


let lastJson = null;
fileInput.addEventListener('change', async (e) => {
const f = e.target.files[0];
if (!f) return;
const txt = await f.text();
lastJson = JSON.parse(txt);
out.textContent = JSON.stringify(lastJson, null, 2);
});


btn.addEventListener('click', async () => {
if (!lastJson) {
out.textContent = 'No input loaded.';
return;
}
out.textContent = 'Generando prueba (esto puede tardar)...';
try {
const res = await generateProofFromInputFile(lastJson);
out.textContent = JSON.stringify(res, null, 2);
} catch (err) {
out.textContent = err.toString();
}
});