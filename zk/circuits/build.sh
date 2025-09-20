# Script para compilar el circuito y generar claves/zkey
#!/usr/bin/env bash
set -e


CIRCUIT=membership.circom
R1CS=membership.r1cs
WASM=membership_js


# 1) compilar
circom $CIRCUIT --r1cs --wasm --sym -o build


# 2) generar powers of tau (ptau) si no existe
PTAU=build/pot12_0000.ptau
if [ ! -f "$PTAU" ]; then
echo "Descargando ptau de ejemplo (solo para desarrollo)..."
snarkjs powersoftau new bn128 12 build/pot12_0000.ptau -v
snarkjs powersoftau contribute build/pot12_0000.ptau build/pot12_0001.ptau --name="First contribution" -v
snarkjs powersoftau prepare phase2 build/pot12_0001.ptau build/pot12_0000.ptau
fi


# 3) setup zkey
snarkjs plonk setup build/$R1CS build/pot12_0000.ptau build/membership_final.zkey


# 4) export verification key
snarkjs zkey export verificationkey build/membership_final.zkey build/verification_key.json


# 5) compilar wasm (ya generado por circom) -> mover a build dir
mv membership_js build/ || true


echo "Build completo. Artefactos en build/"

