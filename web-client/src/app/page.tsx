
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
      <main style={{ padding: 24 }}>
        <h1>NoDoQ — Frontend</h1>
        <button onClick={connectWallet} style={{ padding: 8, fontSize: 16 }}>
          Connect MetaMask
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </main>
    );
  }

  if (currentView === "welcome") {
    return (
      <main style={{ padding: 24 }}>
        <h1>Welcome to City Voting</h1>
        <p>Participate in your neighborhood's democratic decisions.</p>
        <button onClick={handleSignUp} style={{ padding: 8, fontSize: 16, marginRight: 8 }}>
          SIGN UP
        </button>
        <button onClick={handleVoting} style={{ padding: 8, fontSize: 16 }}>
          VOTING
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </main>
    );
  }

  if (currentView === "signup") {
    return (
      <main style={{ padding: 24 }}>
        <h1>Welcome to Registration</h1>
        <p>Please enter your details to register with your wallet.</p>
        <input
          type="text"
          placeholder="ID (10 digits)"
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={{ display: 'block', marginBottom: 8 }}
        />
        <select
          value={selectedNeighborhood}
          onChange={(e) => setSelectedNeighborhood(e.target.value)}
          style={{ display: 'block', marginBottom: 8 }}
        >
          <option value="">Select Neighborhood</option>
          {neighborhoods.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <button onClick={() => submitSignUp(id, selectedNeighborhood)} style={{ padding: 8, fontSize: 16 }}>
          Register
        </button>
        <button onClick={() => setCurrentView("welcome")} style={{ padding: 8, fontSize: 16, marginLeft: 8 }}>
          Back
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </main>
    );
  }

  if (currentView === "voting") {
    return (
      <main style={{ padding: 24 }}>
        <h1>Voting</h1>
        <p>Your neighborhood: {neighborhood}</p>
        <p>You can participate in the following votes:</p>
        {!votedPresident && (
          <button onClick={() => setCurrentView("presidentVote")} style={{ padding: 8, fontSize: 16, marginRight: 8 }}>
            Vote for Neighborhood President
          </button>
        )}
        {!votedPark && (
          <button onClick={() => setCurrentView("parkVote")} style={{ padding: 8, fontSize: 16 }}>
            Vote on Park Improvements
          </button>
        )}
        <button onClick={() => setCurrentView("welcome")} style={{ padding: 8, fontSize: 16, marginTop: 16 }}>
          Back
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </main>
    );
  }

  if (currentView === "presidentVote") {
    return (
      <main style={{ padding: 24 }}>
        <h1>Vote for Neighborhood President</h1>
        <p>Choose your candidate:</p>
        <button onClick={() => votePresident("Candidate A")} style={{ padding: 8, fontSize: 16, marginRight: 8 }}>
          Candidate A
        </button>
        <button onClick={() => votePresident("Candidate B")} style={{ padding: 8, fontSize: 16, marginRight: 8 }}>
          Candidate B
        </button>
        <button onClick={() => votePresident("Candidate C")} style={{ padding: 8, fontSize: 16 }}>
          Candidate C
        </button>
        <button onClick={() => setCurrentView("voting")} style={{ padding: 8, fontSize: 16, marginTop: 16 }}>
          Back
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </main>
    );
  }

  if (currentView === "parkVote") {
    return (
      <main style={{ padding: 24 }}>
        <h1>Vote on Park Improvements</h1>
        <p>Do you agree to use neighborhood funds for park repairs?</p>
        <button onClick={() => votePark("Yes")} style={{ padding: 8, fontSize: 16, marginRight: 8 }}>
          Yes
        </button>
        <button onClick={() => votePark("No")} style={{ padding: 8, fontSize: 16 }}>
          No
        </button>
        <button onClick={() => setCurrentView("voting")} style={{ padding: 8, fontSize: 16, marginTop: 16 }}>
          Back
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </main>
    );
  }

  return null;
}
