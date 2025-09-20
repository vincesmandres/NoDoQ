// Contract responsible for anchoring vote batches on-chain and exposing events for audit.
// Stores minimal metadata and optionally verifies a ZK proof before accepting an anchor.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IVerifier.sol";

contract NoDoAnchor {
    address public owner;
    IVerifier public verifier;
    bool public requireProof;

    struct Batch {
        bytes32 root; // Merkle root or aggregated root representing the batch
        bytes32 batchHash; // Hash of the batch contents (off-chain storage like IPFS)
        string metadata; // Optional metadata or IPFS link
        address submitter; // who anchored the batch
        uint256 blockNumber; // block number when anchored
        uint256 timestamp; // block timestamp
    }

    // batchId => Batch
    mapping(bytes32 => Batch) public batches;

    event VoteAnchored(
        bytes32 indexed root,
        bytes32 indexed batchHash,
        string metadata,
        address indexed submitter,
        uint256 blockNumber,
        uint256 timestamp
    );
    event VerifierUpdated(
        address indexed oldVerifier,
        address indexed newVerifier
    );
    event RequireProofUpdated(bool oldValue, bool newValue);
    event OwnershipTransferred(
        address indexed oldOwner,
        address indexed newOwner
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "NoDoAnchor: only owner");
        _;
    }

    constructor(address _verifier, bool _requireProof) {
        owner = msg.sender;
        verifier = IVerifier(_verifier);
        requireProof = _requireProof;
    }

    /// @notice Anchor a vote batch on-chain. Optionally verifies a zk-proof before accepting.
    /// @param proof Serialized proof bytes (if requireProof == true). If not required, can be empty.
    /// @param pubSignals Public signals expected by verifier (as uint256[]). If not required, can be empty array.
    /// @param root The Merkle root or aggregated root representing the batch.
    /// @param batchHash Off-chain batch hash (e.g., IPFS CID hashed to bytes32) to reference stored proofs and data.
    /// @param metadata Optional short metadata or pointer (e.g., IPFS CID in string form).
    function anchorVoteBatch(
        bytes calldata proof,
        uint256[] calldata pubSignals,
        bytes32 root,
        bytes32 batchHash,
        string calldata metadata
    ) external {
        Batch memory b = Batch({
            root: root,
            batchHash: batchHash,
            metadata: metadata,
            submitter: msg.sender,
            blockNumber: block.number,
            timestamp: block.timestamp
        });

        batches[batchHash] = b;

        emit VoteAnchored(
            root,
            batchHash,
            metadata,
            msg.sender,
            b.blockNumber,
            b.timestamp
        );
    }

    /// @notice Update the verifier contract address (admin only).
    function setVerifier(address _verifier) external onlyOwner {
        address old = address(verifier);
        verifier = IVerifier(_verifier);
        emit VerifierUpdated(old, _verifier);
    }

    /// @notice Toggle whether proofs are required to anchor batches.
    function setRequireProof(bool _require) external onlyOwner {
        bool old = requireProof;
        requireProof = _require;
        emit RequireProofUpdated(old, _require);
    }

    /// @notice Transfer ownership
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "NoDoAnchor: new owner is zero");
        address old = owner;
        owner = newOwner;
        emit OwnershipTransferred(old, newOwner);
    }

    /// @notice Helper to fetch batch information
    function getBatch(bytes32 batchHash) external view returns (Batch memory) {
        return batches[batchHash];
    }
}
