import { ethers } from 'ethers';
import type { Eip1193Provider } from 'ethers';
import type { MembershipProof } from './zk';

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
  args: MembershipProof;
}) {
  const { ethereum } = window as typeof window & { ethereum?: Eip1193Provider };
  if (!ethereum) throw new Error('No wallet found');

  const provider = new ethers.BrowserProvider(ethereum);
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