import type { MembershipProveInput } from '../../src/lib/zk';

type FullProofResult = {
  proof: {
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
  };
  publicSignals: string[];
};

declare module 'snarkjs' {
  export const groth16: {
    fullProve(
      input: MembershipProveInput,
      wasm: ArrayBuffer,
      zkey: ArrayBuffer
    ): Promise<FullProofResult>;
  };
}
