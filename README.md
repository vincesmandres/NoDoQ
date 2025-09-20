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
4. El backend **aggregator** verifica off-chain, marca nullifier y agrega el voto.  
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
├─ circuits/         # circuitos ZK
│   └─ membership.circom
├─ contracts/        # contratos Solidity
│   └─ NoDoAnchor.sol
├─ prover/           # snarkjs setup + build
│   └─ build/
├─ aggregator-api/   # backend Node/Express
│   └─ src/index.ts
├─ web-client/       # Next.js/React PWA
│   └─ src/app/page.tsx
├─ scripts/          # helpers de despliegue
├─ README.md
├─ .gitignore
└─ LICENSE
```

---

## Próximos pasos

- [ ] **Paso 8**: compilar circuito base `membership.circom` con Circom y snarkjs.  
- [ ] **Paso 9**: levantar API mínima (`aggregator-api`) y conectar con Redis.  
- [ ] **Paso 10**: crear cliente web (Next.js) con botón de prueba (fake proof).  
- [ ] **Paso 11+**: integrar pruebas reales (`wasm` + `zkey`) y verificar off-chain.  
- [ ] **Paso 12**: exportar contrato verificador y probar en zkEVM testnet.  

---

## Estado

MVP en construcción – Hackatón interno del **ZKET Core Program Ecuador 2025**.  
Objetivo: demo funcional de votación barrial con ZK, Auth3 y anclaje en zkEVM testnet.  
