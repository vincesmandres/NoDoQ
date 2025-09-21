
"use client";
import { useState } from "react";
import { ethers } from "ethers";

interface EthereumProvider {
  isMetaMask?: boolean;
  request?: (args: { method: string; params?: Array<any> }) => Promise<any>;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export default function Page() {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask no está instalado");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al conectar");
      }
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>NoDoQ — Frontend</h1>
      {account ? (
        <div>
          <p>Conectado: {account}</p>
        </div>
      ) : (
        <button onClick={connectWallet} style={{ padding: 8, fontSize: 16 }}>
          Conectar MetaMask
        </button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </main>
  );
}
