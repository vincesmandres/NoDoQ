# NoDoQ
NoDo: ZK-powered local voting for Ecuador.  Nodo → blockchain. No doble → nullifiers evitan doble voto.  Walletless login (Auth3), zk-SNARK membership + nullifier proofs,  off-chain verification and zkEVM anchoring for public auditability.

> No doble → nullifiers que garantizan **una persona, un voto**.

## Idea
**NoDo** es un sistema de votaciones y consultas ciudadanas locales (barrios, parroquias) 
basado en **zero-knowledge proofs**.  
Cada ciudadano prueba que pertenece a un padrón y que no ha votado más de una vez, 
sin revelar su identidad ni su ubicación.

- **ZK Membership + Nullifier** → pertenencia + unicidad.
- **Walletless login (Auth3)** → UX accesible sin necesidad de wallets cripto.
- **Off-chain verification + zkEVM anchoring** → bajo costo, auditabilidad pública.
- **Kiosks comunitarios** → inclusión digital para quienes no usan smartphones.

## Flujo demo
1. Login vía Auth3 (ej: SMS / social login).  
2. El sistema emite una credencial verificable (VC) de pertenencia al padrón de la parroquia.  
3. Usuario genera una prueba ZK: `membership + nullifier(epoch,pollId)`.  
4. El backend **aggregator** verifica off-chain, marca nullifier y agrega el voto.  
5. Cada batch se ancla en zkEVM testnet como `VoteAnchored(root, batchHash)`.  
6. El panel muestra conteo y enlace a la transacción.

## Stack
- **ZK:** Circom + snarkjs (PLONK/ultraPlonk) o Noir.
- **Hash:** Poseidon.
- **Blockchain:** zkEVM testnet (Polygon / zkSync / Scroll).
- **Backend:** Node.js (Express + Redis).
- **Web Client:** Next.js/React + Auth3 + WASM prover.
- **Contracts:** Solidity (Verifier.sol, NoDoAnchor.sol).
