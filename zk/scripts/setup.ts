import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";

mkdirSync("pkey", { recursive: true });

execSync("npx snarkjs powersoftau new bn128 12 pkey/pot12_0000.ptau -v", { stdio: "inherit" });
execSync("npx snarkjs powersoftau contribute pkey/pot12_0000.ptau pkey/pot12_0001.ptau -e='nodoq' -v", { stdio: "inherit" });
execSync("npx snarkjs powersoftau prepare phase2 pkey/pot12_0001.ptau pkey/pot12_final.ptau -v", { stdio: "inherit" });

execSync("npx snarkjs groth16 setup build/semaphore_mvp.r1cs pkey/pot12_final.ptau pkey/semaphore_mvp.zkey", { stdio: "inherit" });
execSync("npx snarkjs zkey export verificationkey pkey/semaphore_mvp.zkey pkey/verification_key.json", { stdio: "inherit" });

console.log("✅ zkey + verification_key.json listos en pkey/");
