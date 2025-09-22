// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IGroth16Verifier
 * @dev Interface for Groth16 zero-knowledge proof verifier
 * Standard interface for verifying Groth16 proofs with inputs a, b, c and public signals
 */
interface IGroth16Verifier {
    /**
     * @notice Verifies a Groth16 proof
     * @param proof_a First part of the proof (G1 point)
     * @param proof_b Second part of the proof (G2 point)
     * @param proof_c Third part of the proof (G1 point)
     * @param publicInputs Array of public input signals
     * @return True if proof is valid, false otherwise
     */
    function verifyProof(
        uint256[2] calldata proof_a,
        uint256[2][2] calldata proof_b,
        uint256[2] calldata proof_c,
        uint256[] calldata publicInputs
    ) external view returns (bool);
}