// zk/scripts/compile.ts
import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
mkdirSync("zk/build", { recursive: true });
execSync(`circom zk/circuits/membership.circom --r1cs --wasm --sym -o zk/build`, { stdio:"inherit" });
execSync(`snarkjs plonk setup zk/build/membership.r1cs zk/build/pot12.ptau zk/build/membership.zkey`, { stdio:"inherit" });
execSync(`snarkjs zkey export verificationkey zk/build/membership.zkey zk/build/verification_key.json`, { stdio:"inherit" });
