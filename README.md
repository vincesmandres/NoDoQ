# ZKMonk

A zero-knowledge voting system inspired by Semaphore, ensuring anonymity and uniqueness with public auditability.

## Pitch

- **Semaphore Integration**: Leverages Semaphore for anonymous signaling and group membership proofs.
- **Anonymity + Uniqueness**: Users prove membership without revealing identity, with nullifiers preventing double-voting.
- **Public Audit**: All votes are anchored on-chain, enabling transparent verification without compromising privacy.

## Architecture

The system follows a modular architecture: `zk/` for zero-knowledge circuits, `contracts/` for blockchain integration, and `app/` for the user interface.

```
zk/ → contracts/ → app/
  ↓       ↓         ↓
Circuits  Smart     Frontend
          Contracts
```

## Quickstart

Install dependencies and run the full stack:

```bash
pnpm i
pnpm zk:compile
pnpm contracts:build
pnpm contracts:deploy --network sepolia
pnpm app:dev
```

## Demo Steps (1-2 minutes)

1. Connect your wallet to the application.
2. Choose a poll from the available options.
3. Generate a zero-knowledge proof for your vote.
4. Submit the proof and vote transaction.
5. View the on-chain event confirming your anonymous vote.

## Security

- **Nullifier Anti-Double Vote**: Each user generates a unique nullifier per poll to prevent multiple submissions.
- **Size Limits**: Circuit constraints limit proof sizes to ensure efficient verification.
- **No Sensitive Logs**: All logging avoids exposing user data or proof internals.

## Roadmap

- Integrate MACI for collusion-resistant voting.
- Optional Sui blockchain anchoring for multi-chain support.
- zkTLS integration for data provenance and external attestations.

## Troubleshooting (Windows/PowerShell)

- Ensure Node.js and pnpm are installed via official installers.
- For Circom compilation issues, verify Rust toolchain is properly set up.
- If Hardhat deployment fails, check your Sepolia RPC endpoint and private key configuration.
- Use `pnpm --version` to confirm pnpm is available in PowerShell.
- For WASM-related errors, ensure Emscripten is installed if compiling custom circuits.
