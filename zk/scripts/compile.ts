import { execSync } from "child_process";
import { mkdirSync } from "fs";

mkdirSync("build", { recursive: true });

// Usa "npx circom" para garantizar que se resuelva el binario
execSync("npx circom circuits/semaphore_mvp.circom --r1cs --wasm --sym -o build", { stdio: "inherit" });
console.log("✅ Compilado: build/*.r1cs, build/*_js/semaphore_mvp.wasm, build/*.sym");
