// Copia los artefactos compilados del circuito (circuits/build) hacia /public para que el navegador los cargue
// Uso: node scripts/copy-artifacts.js


const fs = require('fs');
const path = require('path');


const fromDir = path.resolve(__dirname, '..', '..', 'circuits', 'build');
const toDir = path.resolve(__dirname, '..', 'public');


if (!fs.existsSync(fromDir)) {
console.error('No se encontró build de circuits en:', fromDir);
process.exit(1);
}


if (!fs.existsSync(toDir)) fs.mkdirSync(toDir, { recursive: true });


const items = ['membership_js', 'membership_final.zkey', 'verification_key.json'];


items.forEach(item => {
const src = path.join(fromDir, item);
const dest = path.join(toDir, item);
if (!fs.existsSync(src)) {
console.warn('Advertencia: artefacto no existe:', src);
return;
}
const stat = fs.statSync(src);
if (stat.isDirectory()) {
copyFolderRecursiveSync(src, dest);
} else {
fs.copyFileSync(src, dest);
}
});


console.log('Copiado artefactos a', toDir);


function copyFolderRecursiveSync(source, target) {
const files = [];
// create target folder if not exist
if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });


// copy
if (fs.lstatSync(source).isDirectory()) {
const items = fs.readdirSync(source);
items.forEach(function(item) {
const curSource = path.join(source, item);
const curTarget = path.join(target, item);
if (fs.lstatSync(curSource).isDirectory()) {
copyFolderRecursiveSync(curSource, curTarget);
} else {
fs.copyFileSync(curSource, curTarget);
}
});
}
}