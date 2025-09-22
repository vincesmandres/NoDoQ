export async function proveMembership(input: any) {
  // @ts-ignore
  const snarkjs = await import('snarkjs');

  const wasmResponse = await fetch('/membership.wasm');
  const wasmBuffer = await wasmResponse.arrayBuffer();

  const zkeyResponse = await fetch('/membership.zkey');
  const zkeyBuffer = await zkeyResponse.arrayBuffer();

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, wasmBuffer, zkeyBuffer);

  const a = proof.pi_a.slice(0, 2).map((x: string) => BigInt(x));
  const b = proof.pi_b.map((row: string[]) => row.map((x: string) => BigInt(x)));
  const c = proof.pi_c.slice(0, 2).map((x: string) => BigInt(x));

  const root = BigInt(publicSignals[0]);
  const nullifierHash = BigInt(publicSignals[1]);
  const signalHash = BigInt(publicSignals[2]);
  const externalNullifier = BigInt(publicSignals[3]);

  return { a, b, c, root, nullifierHash, signalHash, externalNullifier };
}