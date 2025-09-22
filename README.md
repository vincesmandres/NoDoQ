# NoDoQ

> Nodo → blockchain.  
> No doble → nullifiers que garantizan **una persona, un voto**.

**NoDoQ** es un sistema de votaciones y consultas ciudadanas locales (barrios, parroquias) 
basado en **zero-knowledge proofs (ZKPs)**.  
Cada ciudadano prueba que pertenece a un padrón y que no ha votado más de una vez, 
sin revelar su identidad ni su ubicación.

---

## Idea

- **ZK Membership + Nullifier** → pertenencia + unicidad.  
- **Walletless login (Auth3)** → UX accesible sin necesidad de wallets cripto.  
- **Off-chain verification + zkEVM anchoring** → bajo costo, auditabilidad pública.  
- **Kiosks comunitarios** → inclusión digital para quienes no usan smartphones.  

---

## Flujo demo

1. Login vía Auth3 (ej: SMS / social login).  
2. El sistema emite una credencial verificable (VC) de pertenencia al padrón de la parroquia.  
3. Usuario genera una prueba ZK: `membership + nullifier(epoch,pollId)`.  
4. El backend **aggregator** verifica off-chai
n, marca nullifier y agrega el voto.  
5. Cada batch se ancla en zkEVM testnet como `VoteAnchored(root, batchHash)`.  
6. El panel muestra conteo y enlace a la transacción.

---

## Stack

- **ZK:** Circom + snarkjs (PLONK/ultraPlonk) o Noir  
- **Hash:** Poseidon  
- **Blockchain:** zkEVM testnet (Polygon / zkSync / Scroll)  
- **Backend:** Node.js (Express + Redis)  
- **Web Client:** Next.js/React + Auth3 + WASM prover  
- **Contracts:** Solidity (Verifier.sol, NoDoAnchor.sol)  

---

## Instalación y Setup (Codespaces)

### 1. Dependencias del sistema
```bash
sudo apt-get update
sudo apt-get install -y build-essential git curl pkg-config libssl-dev libgmp-dev redis-server
sudo service redis-server start
```

### 2. Node + pnpm
```bash
corepack enable
pnpm setup
export PATH="$PNPM_HOME:$PATH"
```

### 3. Rust + Circom
```bash
curl https://sh.rustup.rs -sSf | sh -s -- -y
source $HOME/.cargo/env
cargo install --locked --git https://github.com/iden3/circom.git
```

### 4. snarkjs local
```bash
pnpm add -D snarkjs
```

### 5. Powers of Tau (para PLONK)
```bash
mkdir -p prover/build
curl -L https://raw.githubusercontent.com/iden3/snarkjs/master/ptau/powersOfTau28_hez_final_12.ptau -o prover/build/pot12.ptau
```

---

## 📂 Estructura del repo

```
NoDoQ/
├─ backend/          # servicio aggregator (Node/Express)
│   └─ src/
├─ contracts/        # contratos Solidity y artefactos compilados
│   ├─ artifacts/    # ABI + build-info del ancla/verificador
│   └─ *.sol
├─ web-client/       # cliente web (Next.js/React)
│   └─ src/
├─ zk/               # circuitos y utilidades de pruebas ZK
│   ├─ circuits/
│   └─ prover-wasm/
├─ README.md
└─ LICENSE
```

> 🧹 **Limpieza de legado**: el antiguo `frontend/` (Next.js 13), los artefactos de contratos en la raíz y el workspace `NoDo/` de pnpm fueron retirados. Toda la app web vive en `web-client/` y los ABI/artefactos se centralizan ahora en `contracts/artifacts/`.

---

## Próximos pasos

- [ ] **Paso 8**: compilar circuito base `membership.circom` con Circom y snarkjs.  
- [ ] **Paso 9**: levantar API mínima (`backend`) y conectar con Redis.
- [ ] **Paso 10**: crear cliente web (Next.js) con botón de prueba (fake proof).  
- [ ] **Paso 11+**: integrar pruebas reales (`wasm` + `zkey`) y verificar off-chain.  
- [ ] **Paso 12**: exportar contrato verificador y probar en zkEVM testnet.  

---

## ZK Quickcheck

Para verificar que el circuito ZK funciona correctamente:

### 1. Compilar circuito con Groth16
```bash
cd zk
pnpm zk:compile
```

### 2. Ejecutar prueba local completa
```bash
cd zk
pnpm zk:test
```

### 3. Ejecutar quickcheck (compila + prueba)
```bash
cd zk
pnpm zk:quickcheck
```

**Resultado esperado**: El comando debe imprimir `LOCAL_ZK_OK - Proof verification successful!`

### Archivos generados
- `zk/build/test.r1cs` - Restricciones del circuito
- `zk/build/test_js/test.wasm` - WebAssembly para el navegador
- `zk/build/test.zkey` - Clave de prueba Groth16
- `zk/build/verification_key.json` - Clave de verificación

---

## Estado

MVP en construcción – Hackatón interno del **ZKET Core Program Ecuador 2025**.
Objetivo: demo funcional de votación barrial con ZK, Auth3 y anclaje en zkEVM testnet.
