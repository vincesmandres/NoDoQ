# NoDoQ

> Nodo → blockchain.
> No doble → nullifiers que garantizan **una persona, un voto**.

**NoDoQ** is a local community voting and consultation system (neighborhoods, parishes) based on **zero-knowledge proofs (ZKPs)**. Each citizen proves they belong to a registry and have not voted more than once, without revealing their identity or location.

## The Problem

Traditional voting systems in neighborhoods and small communities often face:
- Low participation rates
- Lack of transparency and trust
- Potential for manipulation or fraud
- Limited accessibility for digitally underserved populations
- Centralized control that can be compromised

We needed a secure, private, and verifiable voting solution that empowers citizens while maintaining anonymity.

## The Solution

NoDoQ combines blockchain technology with zero-knowledge cryptography to create a decentralized, privacy-preserving voting platform. Key features:
- **ZK Membership + Nullifier**: Proves eligibility and prevents double voting
- **Walletless Login (Auth3)**: Accessible UX without requiring crypto wallets
- **Off-chain Verification + zkEVM Anchoring**: Low-cost, publicly auditable results
- **Community Kiosks**: Digital inclusion for smartphone-less users

## Demo Flow

1. Login via Auth3 (e.g., SMS/social login)
2. System issues a verifiable credential (VC) of parish registry membership
3. User generates ZK proof: `membership + nullifier(epoch, pollId)`
4. Backend aggregator verifies off-chain, marks nullifier, and aggregates vote
5. Each batch is anchored on zkEVM testnet as `VoteAnchored(root, batchHash)`
6. Dashboard shows tally and links to transactions

## Technology Stack

### Zero-Knowledge Layer
- **Circom**: Domain-specific language for ZK circuits
- **snarkjs**: JavaScript library for SNARK generation and verification (PLONK/ultraPlonk)
- **Poseidon Hash**: Efficient cryptographic hash function for ZK proofs
- **MACI (Minimum Anti-Collusion Infrastructure)**: Privacy-preserving voting protocol

### Blockchain Layer
- **zkEVM Testnet**: Layer 2 scaling solution (Polygon zkEVM, Scroll, or zkSync)
- **Solidity Smart Contracts**: NoDoAnchor.sol for batch anchoring, IVerifier.sol interface
- **Ethers.js**: Ethereum interaction library

### Backend
- **Node.js + Express**: RESTful API server
- **Redis**: High-performance data store for nullifiers and session management
- **PostgreSQL**: Relational database for votes and batches
- **Pino**: Structured logging

### Frontend
- **Next.js + React**: Modern web framework with server-side rendering
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework (custom implementation)
- **WebAssembly (WASM)**: Client-side proof generation
- **MetaMask Integration**: Wallet connection and transaction signing

### Development Tools
- **Hardhat**: Ethereum development environment for smart contracts
- **pnpm**: Fast, disk-efficient package manager
- **ESLint + Prettier**: Code linting and formatting
- **Docker**: Containerization for consistent environments

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │     Backend     │    │   Smart         │
│   (Next.js)     │◄──►│  (Node/Express) │◄──►│   Contracts     │
│                 │    │                 │    │   (Solidity)    │
│ • User Interface│    │ • Vote Aggregation│    │ • Batch Anchor │
│ • Proof Gen     │    │ • Nullifier Check │    │ • Verification │
│ • Wallet Connect│    │ • Redis Cache     │    │ • Events       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   zkEVM Chain   │
                    │   (Testnet)     │
                    └─────────────────┘
```

## Installation and Setup

### Prerequisites
- Node.js 18+
- pnpm
- Rust
- Circom
- Redis
- PostgreSQL
- MetaMask browser extension

### System Dependencies
```bash
sudo apt-get update
sudo apt-get install -y build-essential git curl pkg-config libssl-dev libgmp-dev redis-server postgresql
sudo service redis-server start
sudo service postgresql start
```

### Development Setup
```bash
# Clone repository
git clone https://github.com/your-org/NoDoQ.git
cd NoDoQ

# Install dependencies
pnpm install

# Setup databases
createdb nodoq_dev
# Configure .env files in backend/ and web-client/

# Start development servers
pnpm run dev
```

### Detailed Setup by Component

#### Backend Setup
```bash
cd backend
npm install
# Configure .env with DATABASE_URL, REDIS_HOST, etc.
npm run dev
```

#### Smart Contracts Setup
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test
npx hardhat deploy --network sepolia
```

#### Web Client Setup
```bash
cd web-client
npm install
npm run dev
```

#### ZK Circuits Setup
```bash
cd zk/circuits
# Install Circom and snarkjs
bash build.sh
node generate_proof_and_witness.js
```

## Usage

1. **Connect Wallet**: Use MetaMask to connect to Sepolia testnet
2. **Register**: Enter ID and select neighborhood
3. **Vote**: Participate in available polls (president, park improvements)
4. **Verify**: Check transaction hashes on Etherscan for auditability

## Project Structure

```
NoDoQ/
├── backend/              # Aggregator service (Node/Express)
│   ├── src/
│   │   ├── app.js       # Express app setup
│   │   ├── server.js    # Server entry point
│   │   ├── controllers/ # API controllers
│   │   ├── services/    # Business logic
│   │   ├── utils/       # Utilities
│   │   └── zk/          # ZK verification
│   └── migrations/      # Database schemas
├── contracts/           # Solidity smart contracts
│   ├── NoDoAnchor.sol   # Main anchoring contract
│   ├── IVerifier.sol    # Verifier interface
│   ├── VerifierStub.sol # Development verifier
│   └── artifacts/       # Compiled contracts
├── web-client/          # Frontend application
│   ├── src/
│   │   ├── app/         # Next.js app router
│   │   ├── components/  # React components
│   │   └── styles/      # CSS styles
│   └── public/          # Static assets
├── zk/                  # Zero-knowledge components
│   ├── circuits/        # Circom circuits
│   │   ├── membership.circom
│   │   └── build.sh
│   └── prover-wasm/     # WebAssembly prover
├── package.json         # Workspace configuration
├── README.md
└── LICENSE
```

## Roadmap

### Phase 1: MVP (Current)
- [x] Basic ZK membership circuit
- [x] Smart contract deployment on testnet
- [x] Web client with MetaMask integration
- [x] Backend API with Redis/PostgreSQL
- [ ] End-to-end voting flow

### Phase 2: Enhanced Features (Q1 2025)
- [ ] Auth3 integration for walletless login
- [ ] Mobile-responsive design
- [ ] Multi-poll support
- [ ] Real-time vote tallying

### Phase 3: Production Ready (Q2 2025)
- [ ] Mainnet deployment on zkEVM
- [ ] Voice credits and quadratic voting
- [ ] Community kiosk hardware
- [ ] Audit and security review

### Phase 4: Scale and Ecosystem (2026)
- [ ] Multi-city deployment
- [ ] Integration with government systems
- [ ] Advanced ZK features ( Noir integration)
- [ ] DAO governance for platform evolution

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Security Considerations

- ZK proofs ensure voter privacy while preventing double voting
- On-chain anchoring provides immutable audit trail
- Smart contracts are upgradeable for bug fixes
- All cryptographic operations use audited libraries

## License

MIT License - see [LICENSE](LICENSE) for details.

## Contact

- Website: [https://nodoq.ec](https://nodoq.ec)
- Twitter: [@NoDoQ_ec](https://twitter.com/NoDoQ_ec)
- Email: hello@nodoq.ec

---

**Status**: MVP in development – Internal hackathon for **ZKET Core Program Ecuador 2025**.
**Goal**: Functional demo of neighborhood voting with ZK, Auth3, and zkEVM anchoring.
