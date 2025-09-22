'use client';

import { useState } from 'react';
import { proveMembership } from '../../lib/zk';
import type { MembershipProof } from '../../lib/zk';
import { castVoteEVM } from '../../lib/evm';

export default function VotePage() {
  const [externalNullifier, setExternalNullifier] = useState('');
  const [signal, setSignal] = useState('');
  const [proof, setProof] = useState<MembershipProof | null>(null);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string>('');

  const handleGenerateProof = async () => {
    setGenerating(true);
    try {
      // Hardcoded input for demo, in real app get from user or storage
      const input = {
        identity_secret: '3',
        pathElements: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
        pathIndex: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
        merkle_root: '0',
        external_nullifier: externalNullifier,
        sig: signal,
        nullifier_hash: '0',
        signal_binding: '0'
      };
      const result = await proveMembership(input);
      setProof(result);
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmitVote = async () => {
    if (!proof) return;
    setSubmitting(true);
    try {
      const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // placeholder, replace with actual
      const hash = await castVoteEVM({ address: address as `0x${string}`, args: proof });
      setTxHash(hash);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Vote</h1>
      <div>
        <label>External Nullifier:</label>
        <input value={externalNullifier} onChange={(e) => setExternalNullifier(e.target.value)} />
      </div>
      <div>
        <label>Signal:</label>
        <input value={signal} onChange={(e) => setSignal(e.target.value)} />
      </div>
      <button onClick={handleGenerateProof} disabled={generating}>
        {generating ? 'Generating...' : 'Generar prueba'}
      </button>
      {proof && (
        <div>
          <p>Proof generated</p>
          <button onClick={handleSubmitVote} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Enviar voto (MetaMask)'}
          </button>
        </div>
      )}
      {txHash && (
        <div>
          <p>Tx Hash: {txHash}</p>
          <a href={`https://etherscan.io/tx/${txHash}`} target="_blank">View on Explorer</a>
        </div>
      )}
    </div>
  );
}