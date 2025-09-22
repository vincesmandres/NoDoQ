
"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

interface EthereumProvider {
  isMetaMask?: boolean;
  request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const neighborhoods = [
  "NEIGHBORHOOD 1",
  "NEIGHBORHOOD 2",
  "NEIGHBORHOOD 3",
  "NEIGHBORHOOD 4",
  "NEIGHBORHOOD 5",
  "NEIGHBORHOOD 6",
  "NEIGHBORHOOD 7",
  "NEIGHBORHOOD 8",
  "NEIGHBORHOOD 9",
  "NEIGHBORHOOD 10"
];

export default function Page() {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState<boolean>(false);
  const [neighborhood, setNeighborhood] = useState<string>("");
  const [votedPresident, setVotedPresident] = useState<boolean>(false);
  const [votedPark, setVotedPark] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>("connect");
  const [id, setId] = useState<string>("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("");
  const [registeredWallets, setRegisteredWallets] = useState<Record<string, { id: string; neighborhood: string }>>({});
  const [votedWallets, setVotedWallets] = useState<Record<string, { votedPresident: boolean; votedPark: boolean }>>({});
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  // Load from localStorage
  useEffect(() => {
    const reg = localStorage.getItem('registeredWallets');
    if (reg) setRegisteredWallets(JSON.parse(reg));
    const vot = localStorage.getItem('votedWallets');
    if (vot) setVotedWallets(JSON.parse(vot));
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum as unknown as ethers.Eip1193Provider);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signerInstance = await provider.getSigner();
      setAccount(accounts[0]);
      setSigner(signerInstance);
      // Load user state
      const reg = registeredWallets[accounts[0]];
      if (reg) {
        setRegistered(true);
        setNeighborhood(reg.neighborhood);
      }
      const vot = votedWallets[accounts[0]];
      if (vot) {
        setVotedPresident(vot.votedPresident);
        setVotedPark(vot.votedPark);
      }
      setError(null);
      setCurrentView("welcome");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error connecting");
      }
    }
  };

  const handleSignUp = () => {
    setCurrentView("signup");
  };

  const handleVoting = () => {
    setCurrentView("voting");
  };

  const submitSignUp = async (id: string, selectedNeighborhood: string) => {
    if (!account || !signer) {
      setError("No wallet connected");
      return;
    }
    if (!/^\d{10}$/.test(id)) {
      setError("ID must be exactly 10 digits");
      return;
    }
    // Check if wallet already registered
    if (registeredWallets[account]) {
      setError("This wallet is already registered");
      return;
    }
    // Check if ID already used
    const idUsed = Object.values(registeredWallets).some(reg => reg.id === id);
    if (idUsed) {
      setError("This ID is already registered");
      return;
    }
    // Simulate blockchain contract for registration
    try {
      // Here you would interact with the smart contract
      // For now, just set registered and neighborhood
      const newRegistered = { ...registeredWallets, [account]: { id, neighborhood: selectedNeighborhood } };
      setRegisteredWallets(newRegistered);
      localStorage.setItem('registeredWallets', JSON.stringify(newRegistered));
      setRegistered(true);
      setNeighborhood(selectedNeighborhood);
      setCurrentView("welcome");
      setError(null);
    } catch (err) {
      setError("Error registering");
    }
  };

  const votePresident = async (option: string) => {
    if (!account || !signer) {
      setError("No wallet connected");
      return;
    }
    // Check if already voted
    if (votedWallets[account]?.votedPresident) {
      setError("You have already voted for president");
      return;
    }
    // Simulate blockchain transaction for voting
    try {
      // Simulate blockchain transaction for voting
      const tx = await signer.sendTransaction({
        to: "0x0000000000000000000000000000000000000000", // dummy address
        value: 0
      });
      await tx.wait();
      // Update voted
      const newVoted = { ...votedWallets, [account]: { ...votedWallets[account], votedPresident: true } };
      setVotedWallets(newVoted);
      localStorage.setItem('votedWallets', JSON.stringify(newVoted));
      setVotedPresident(true);
      alert("Thank you for your vote!");
      setCurrentView("voting");
    } catch (err) {
      setError("Error voting");
    }
  };

  const votePark = async (option: string) => {
    if (!account || !signer) {
      setError("No wallet connected");
      return;
    }
    // Check if already voted
    if (votedWallets[account]?.votedPark) {
      setError("You have already voted for park improvements");
      return;
    }
    // Simulate blockchain transaction for voting
    try {
      // Simulate blockchain transaction for voting
      const tx = await signer.sendTransaction({
        to: "0x0000000000000000000000000000000000000000", // dummy address
        value: 0
      });
      await tx.wait();
      // Update voted
      const newVoted = { ...votedWallets, [account]: { ...votedWallets[account], votedPark: true } };
      setVotedWallets(newVoted);
      localStorage.setItem('votedWallets', JSON.stringify(newVoted));
      setVotedPark(true);
      alert("Thank you for your vote!");
      setCurrentView("voting");
    } catch (err) {
      setError("Error voting");
    }
  };

  if (currentView === "connect") {
    return (
      <div className="container">
        <header className="header">
          <h1>NoDoQ — City Voting System</h1>
          <p>Secure, decentralized neighborhood voting powered by blockchain</p>
        </header>
        <div className="card">
          <h2>Connect Your Wallet</h2>
          <p>To participate in the voting process, please connect your MetaMask wallet.</p>
          <button className="btn-primary" onClick={connectWallet} style={{ marginTop: 20 }}>
            Connect MetaMask
          </button>
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    );
  }

  if (currentView === "welcome") {
    return (
      <div className="container">
        <header className="header">
          <h1>Welcome to City Voting</h1>
          <p>Participate in your neighborhood's democratic decisions.</p>
        </header>
        <div className="grid">
          <div className="card">
            <h3>Register</h3>
            <p>Sign up with your ID and neighborhood to participate in voting.</p>
            <button className="btn-primary" onClick={handleSignUp} style={{ marginTop: 20 }}>
              SIGN UP
            </button>
          </div>
          <div className="card">
            <h3>Vote</h3>
            <p>Cast your votes on current neighborhood issues.</p>
            <button className="btn-primary" onClick={handleVoting} style={{ marginTop: 20 }}>
              VOTING
            </button>
          </div>
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    );
  }

  if (currentView === "signup") {
    return (
      <div className="container">
        <header className="header">
          <h1>Registration</h1>
          <p>Please enter your details to register with your wallet.</p>
        </header>
        <div className="card">
          <div className="form-group">
            <label htmlFor="id">ID (10 digits)</label>
            <input
              id="id"
              type="text"
              placeholder="Enter your 10-digit ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="neighborhood">Neighborhood</label>
            <select
              id="neighborhood"
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
            >
              <option value="">Select Neighborhood</option>
              {neighborhoods.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button className="btn-primary" onClick={() => submitSignUp(id, selectedNeighborhood)}>
              Register
            </button>
            <button className="btn-secondary" onClick={() => setCurrentView("welcome")}>
              Back
            </button>
          </div>
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    );
  }

  if (currentView === "voting") {
    return (
      <div className="container">
        <header className="header">
          <h1>Voting Dashboard</h1>
          <p>Your neighborhood: <strong>{neighborhood}</strong></p>
        </header>
        <div className="grid">
          {!votedPresident && (
            <div className="vote-option card" onClick={() => setCurrentView("presidentVote")}>
              <h3>🏛️ Neighborhood President</h3>
              <p>Choose your candidate for the neighborhood presidency.</p>
            </div>
          )}
          {!votedPark && (
            <div className="vote-option card" onClick={() => setCurrentView("parkVote")}>
              <h3>🌳 Park Improvements</h3>
              <p>Vote on whether to use neighborhood funds for park repairs.</p>
            </div>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button className="btn-secondary" onClick={() => setCurrentView("welcome")}>
            Back to Main Menu
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    );
  }

  if (currentView === "presidentVote") {
    return (
      <div className="container">
        <header className="header">
          <h1>Vote for Neighborhood President</h1>
          <p>Choose your candidate for the neighborhood presidency.</p>
        </header>
        <div className="grid">
          <div className="vote-option card" onClick={() => votePresident("Candidate A")}>
            <h3>👤 Candidate A</h3>
            <p>Experienced leader focused on community development.</p>
          </div>
          <div className="vote-option card" onClick={() => votePresident("Candidate B")}>
            <h3>👤 Candidate B</h3>
            <p>Innovative thinker promoting sustainable initiatives.</p>
          </div>
          <div className="vote-option card" onClick={() => votePresident("Candidate C")}>
            <h3>👤 Candidate C</h3>
            <p>Dedicated advocate for neighborhood safety and welfare.</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button className="btn-secondary" onClick={() => setCurrentView("voting")}>
            Back to Voting
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    );
  }

  if (currentView === "parkVote") {
    return (
      <div className="container">
        <header className="header">
          <h1>Vote on Park Improvements</h1>
          <p>Do you agree to use neighborhood funds for park repairs and maintenance?</p>
        </header>
        <div className="grid">
          <div className="vote-option card" onClick={() => votePark("Yes")}>
            <h3>✅ Yes</h3>
            <p>Support the use of funds for park improvements.</p>
          </div>
          <div className="vote-option card" onClick={() => votePark("No")}>
            <h3>❌ No</h3>
            <p>Do not support the use of funds for park improvements.</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button className="btn-secondary" onClick={() => setCurrentView("voting")}>
            Back to Voting
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    );
  }

  return null;
}
