import { writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";
import * as circomlib from "circomlibjs";

const DEPTH = 20;

(async () => {
  const poseidon = await (circomlib as any).buildPoseidon();
  const F: any = poseidon.F;
  const H1 = (x: bigint) => BigInt(F.toString(poseidon([x])));
  const H2 = (a: bigint, b: bigint) => BigInt(F.toString(poseidon([a, b])));

  // Árbol binario incremental con zero=0
  const tree = new IncrementalMerkleTree(H2 as any, DEPTH, 0n, 2);

  // Demo: 4 secretos
  const secrets = [1n, 2n, 3n, 4n];
  const leaves = secrets.map(H1);
  leaves.forEach(l => tree.insert(l));

  // Tomamos el índice 2 (secret=3)
  const idx = 2;
  const identity_secret = 3n;
  const external_nullifier = 12345n;
  const signal = 777n;

  const merkle_root = BigInt(tree.root as any);
  const nullifier_hash = H2(identity_secret, external_nullifier);
  const signal_binding = H2(signal, identity_secret);

  const proof = tree.createProof(idx);
  const pathElements = proof.siblings.map((s: any[]) => (s[0] ?? 0n).toString());
  const pathIndex = proof.pathIndices;

  const input = {
    identity_secret: identity_secret.toString(),
    pathElements,
    pathIndex,
    merkle_root: merkle_root.toString(),
    external_nullifier: external_nullifier.toString(),
    signal: signal.toString(),
    nullifier_hash: nullifier_hash.toString(),
    signal_binding: signal_binding.toString()
  };

  writeFileSync("inputs/tmp.input.json", JSON.stringify(input, null, 2));

  // 1) witness
  execSync("node build/semaphore_mvp_js/generate_witness.js build/semaphore_mvp_js/semaphore_mvp.wasm inputs/tmp.input.json inputs/tmp.wtns", { stdio: "inherit" });

  // 2) prueba Groth16
  execSync("npx snarkjs groth16 prove pkey/semaphore_mvp.zkey inputs/tmp.wtns proof.json public.json", { stdio: "inherit" });

  console.log("✅ Prueba generada: proof.json + public.json");
})();
