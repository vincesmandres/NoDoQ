// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IGroth16Verifier.sol";

/**
 * @title NoDoAnchor
 * @dev Contract for anchoring ZK-based votes on-chain with nullifier protection
 *
 * This contract prevents double voting by tracking used nullifiers and verifies
 * Groth16 zero-knowledge proofs before accepting votes.
 *
 * Public signals mapping (4 signals):
 * - publicInputs[0] = root (Merkle root of the membership tree)
 * - publicInputs[1] = nullifierHash (unique identifier for this vote)
 * - publicInputs[2] = signalHash (hash of the vote signal)
 * - publicInputs[3] = externalNullifier (prevents replay across different polls)
 */
contract NoDoAnchor {
    address public owner;
    IGroth16Verifier public verifier;

    // Track used nullifiers to prevent double voting
    mapping(uint256 => bool) public usedNullifiers;

    // Vote data structure
    struct Vote {
        bytes32 root;           // Merkle root of membership tree
        uint256 nullifierHash;  // Unique vote identifier
        uint256 signalHash;     // Hash of the vote signal
        uint256 externalNullifier; // Poll identifier (prevents replay)
        address voter;          // Address of the voter
        uint256 blockNumber;    // Block number when vote was cast
        uint256 timestamp;      // Timestamp when vote was cast
    }

    // externalNullifier => array of votes
    mapping(uint256 => Vote[]) public pollVotes;

    event VoteCast(
        uint256 indexed externalNullifier,
        uint256 indexed nullifierHash,
        bytes32 root,
        uint256 signalHash,
        address indexed voter
    );

    event VerifierUpdated(
        address indexed oldVerifier,
        address indexed newVerifier
    );

    event OwnershipTransferred(
        address indexed oldOwner,
        address indexed newOwner
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "NoDoAnchor: only owner");
        _;
    }

    constructor(address _verifier) {
        owner = msg.sender;
        verifier = IGroth16Verifier(_verifier);
    }

    /**
     * @notice Anchor a single ZK-verified vote on-chain
     * @param proof_a First part of the Groth16 proof (G1 point)
     * @param proof_b Second part of the Groth16 proof (G2 point)
     * @param proof_c Third part of the Groth16 proof (G1 point)
     * @param root Merkle root of the membership tree
     * @param nullifierHash Unique identifier for this vote (prevents double voting)
     * @param signalHash Hash of the vote signal
     * @param externalNullifier Poll identifier (prevents replay across polls)
     */
    function anchor(
        uint256[2] calldata proof_a,
        uint256[2][2] calldata proof_b,
        uint256[2] calldata proof_c,
        bytes32 root,
        uint256 nullifierHash,
        uint256 signalHash,
        uint256 externalNullifier
    ) external {
        // Check if nullifier has already been used (prevent double voting)
        require(!usedNullifiers[nullifierHash], "NoDoAnchor: nullifier already used");

        // Construct public inputs array in the correct order
        // publicInputs[0] = root
        // publicInputs[1] = nullifierHash
        // publicInputs[2] = signalHash
        // publicInputs[3] = externalNullifier
        uint256[] memory publicInputs = new uint256[](4);
        publicInputs[0] = uint256(root);
        publicInputs[1] = nullifierHash;
        publicInputs[2] = signalHash;
        publicInputs[3] = externalNullifier;

        // Verify the ZK proof
        require(verifier.verifyProof(proof_a, proof_b, proof_c, publicInputs),
            "NoDoAnchor: invalid proof");

        // Mark nullifier as used
        usedNullifiers[nullifierHash] = true;

        // Store the vote
        Vote memory vote = Vote({
            root: root,
            nullifierHash: nullifierHash,
            signalHash: signalHash,
            externalNullifier: externalNullifier,
            voter: msg.sender,
            blockNumber: block.number,
            timestamp: block.timestamp
        });

        pollVotes[externalNullifier].push(vote);

        // Emit event
        emit VoteCast(
            externalNullifier,
            nullifierHash,
            root,
            signalHash,
            msg.sender
        );
    }

    /// @notice Update the verifier contract address (admin only).
    function setVerifier(address _verifier) external onlyOwner {
        address old = address(verifier);
        verifier = IGroth16Verifier(_verifier);
        emit VerifierUpdated(old, _verifier);
    }

    /// @notice Transfer ownership
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "NoDoAnchor: new owner is zero");
        address old = owner;
        owner = newOwner;
        emit OwnershipTransferred(old, newOwner);
    }

    /// @notice Get votes for a specific poll
    /// @param externalNullifier The poll identifier
    /// @return Array of votes for the poll
    function getPollVotes(uint256 externalNullifier) external view returns (Vote[] memory) {
        return pollVotes[externalNullifier];
    }

    /// @notice Get total number of votes for a poll
    /// @param externalNullifier The poll identifier
    /// @return Number of votes cast for the poll
    function getPollVoteCount(uint256 externalNullifier) external view returns (uint256) {
        return pollVotes[externalNullifier].length;
    }

    /// @notice Check if a nullifier has been used
    /// @param nullifierHash The nullifier to check
    /// @return True if the nullifier has been used
    function isNullifierUsed(uint256 nullifierHash) external view returns (bool) {
        return usedNullifiers[nullifierHash];
    }
}
