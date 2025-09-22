import { ethers } from 'ethers';

const abi = [
  {
    inputs: [
      { internalType: 'uint256[2]', name: 'proof_a', type: 'uint256[2]' },
      { internalType: 'uint256[2][2]', name: 'proof_b', type: 'uint256[2][2]' },
      { internalType: 'uint256[2]', name: 'proof_c', type: 'uint256[2]' },
      { internalType: 'bytes32', name: 'root', type: 'bytes32' },
      { internalType: 'uint256', name: 'nullifierHash', type: 'uint256' },
      { internalType: 'uint256', name: 'signalHash', type: 'uint256' },
      { internalType: 'uint256', name: 'externalNullifier', type: 'uint256' }
    ],
    name: 'anchor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

export async function castVoteEVM({
  address,
  args
}: {
  address: string;
  args: {
    a: bigint[];
    b: bigint[][];
    c: bigint[];
    root: bigint;
    nullifierHash: bigint;
    signalHash: bigint;
    externalNullifier: bigint;
  };
}) {
  // Assuming MetaMask or wallet is available
  if (!(window as any).ethereum) throw new Error('No wallet found');

  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(address, abi, signer);

  const tx = await contract.anchor(
    args.a,
    args.b,
    args.c,
    args.root,
    args.nullifierHash,
    args.signalHash,
    args.externalNullifier
  );

  return tx.hash;
}