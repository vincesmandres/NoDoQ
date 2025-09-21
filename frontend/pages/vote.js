// /frontend/pages/vote.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { Identity } from '@semaphore-protocol/identity';
import * as semaphoreProof from '@semaphore-protocol/proof';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export default function VotePage() {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [pollId, setPollId] = useState('poll-1');
  const [option, setOption] = useState('A');
  const [status, setStatus] = useState('');

  // Connect wallet (MetaMask)
  async function connectWallet() {
    if (!window.ethereum) return alert('Instala MetaMask u otra wallet compatible');
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();
    setProvider(provider);
    setAddress(addr);
    // For MVP: derive identity from wallet signature (WARNING: not a production identity)
    const message = 'NoDo Semaphore identity derivation - sign to create identity';
    const signature = await signer.signMessage(message);
    // Create Identity from signature hash
    const id = new Identity(signature);
    setIdentity(id);
    setStatus('Wallet conectada y Identity Semaphore creada (MVP).');
  }

  async function generateAndSend() {
    if (!identity) return alert('Conecta una wallet primero.');
    try {
      setStatus('Generando prueba Semaphore y encriptando mensaje (esto puede tardar)...');

      // 1) Build Semaphore signal: typically signal is the vote (e.g., option)
      const signal = option; // string
      // 2) You need the group's merkle root and depth (pulled from backend)
      const groupResp = await axios.get(`${BACKEND}/api/vote/get-group?pollId=${pollId}`);
      const { merkleRoot, groupId, depth, externalNullifier } = groupResp.data;

      // 3) compute identity commitment and generate proof data
      const identityCommitment = identity.generateCommitment();
      // publicSignals expected: identityCommitment, merkleRoot, externalNullifier, signalHash?
      // Use semaphore 'generateProof' helper from @semaphore-protocol/proof
      const witness = await semaphoreProof.generateWitness({
        identityNullifier: identity.getNullifier(), // internal to library API — adapt if necessary
        identityTrapdoor: identity.getTrapdoor(),
        signal: signal,
        externalNullifier: BigInt(externalNullifier).toString(),
        treeDepth: depth,
        leaves: groupResp.data.leaves // backend returned leaves for client proof generation
      });

      const { proof, publicSignals } = await semaphoreProof.generateProof(witness, '/semaphore.wasm', '/semaphore_final.zkey');
      // Note: above paths assume you host semaphore wasm/zkey in frontend public folder or prover service.

      // 4) Build encrypted message per MACI (the "vote message"), for MVP we'll use a simple JSON and let backend encrypt/validate.
      // In a real MACI flow, message must be encrypted with coordinator pubkey.
      const message = {
        pollId,
        option,
        identityCommitment: identityCommitment.toString(),
        // additional MACI fields can go here (timestamp, nonce...)
      };

      // 5) Send to backend: proof + publicSignals + message
      const payload = {
        pollId,
        proof,
        publicSignals,
        message
      };

      const resp = await axios.post(`${BACKEND}/api/vote/semaphore-submit`, payload);
      setStatus('Voto enviado: ' + JSON.stringify(resp.data));
    } catch (err) {
      console.error(err);
      setStatus('Error: ' + (err.response?.data?.error || err.message));
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h2>NoDo — Votar (Semaphore + MACI)</h2>

      <div style={{ marginBottom: 12 }}>
        {!address ? (
          <button onClick={connectWallet}>Conectar wallet (MetaMask)</button>
        ) : (
          <div>
            Wallet: <strong>{address}</strong>
          </div>
        )}
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Poll ID: <input value={pollId} onChange={(e) => setPollId(e.target.value)} /></label>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Opción:
          <select value={option} onChange={(e) => setOption(e.target.value)}>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </label>
      </div>

      <div>
        <button onClick={generateAndSend} disabled={!identity}>Generar prueba y votar</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Estado:</strong>
        <div>{status}</div>
      </div>
    </div>
  );
}
