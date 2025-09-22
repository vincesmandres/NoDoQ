export type MembershipProveInput = {
  identity_secret: string;
  pathElements: string[];
  pathIndex: string[];
  merkle_root: string;
  external_nullifier: string;
  sig: string;
  nullifier_hash: string;
  signal_binding: string;
};

type FullProofResult = {
  proof: {
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
  };
  publicSignals: string[];
};

type SnarkJs = {
  groth16: {
    fullProve(
      input: MembershipProveInput,
      wasm: ArrayBuffer,
      zkey: ArrayBuffer
    ): Promise<FullProofResult>;
  };
};

export type MembershipProof = {
  a: bigint[];
  b: bigint[][];
  c: bigint[];
  root: `0x${string}`;
  nullifierHash: bigint;
  signalHash: bigint;
  externalNullifier: bigint;
};

export async function proveMembership(input: MembershipProveInput): Promise<MembershipProof> {
  const snarkjs = (await import('snarkjs')) as SnarkJs;

  const wasmResponse = await fetch('/membership.wasm');
  const wasmBuffer = await wasmResponse.arrayBuffer();

  const zkeyResponse = await fetch('/membership.zkey');
  const zkeyBuffer = await zkeyResponse.arrayBuffer();

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    wasmBuffer,
    zkeyBuffer
  );

  const a = proof.pi_a.slice(0, 2).map((x: string) => BigInt(x));
  const b = proof.pi_b.map((row: string[]) => row.map((x: string) => BigInt(x)));
  const c = proof.pi_c.slice(0, 2).map((x: string) => BigInt(x));

  const rootBigInt = BigInt(publicSignals[0]);
  const root = `0x${rootBigInt.toString(16).padStart(64, '0')}` as `0x${string}`;
  const nullifierHash = BigInt(publicSignals[1]);
  const signalHash = BigInt(publicSignals[2]);
  const externalNullifier = BigInt(publicSignals[3]);

  return { a, b, c, root, nullifierHash, signalHash, externalNullifier };
}