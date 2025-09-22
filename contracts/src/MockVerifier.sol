// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IGroth16Verifier.sol";

/**
 * @title MockVerifier
 * @dev Mock verifier contract for testing purposes
 * Allows setting whether proofs should be considered valid or invalid
 */
contract MockVerifier is IGroth16Verifier {
    bool private _isValid;

    /**
     * @notice Set whether proofs should be considered valid
     * @param valid True if proofs should be valid, false otherwise
     */
    function setValidProof(bool valid) external {
        _isValid = valid;
    }

    /**
     * @notice Verify a Groth16 proof (mock implementation)
     * @param proof_a First part of the proof
     * @param proof_b Second part of the proof
     * @param proof_c Third part of the proof
     * @param publicInputs Array of public input signals
     * @return True if proof is considered valid, false otherwise
     */
    function verifyProof(
        uint256[2] calldata proof_a,
        uint256[2][2] calldata proof_b,
        uint256[2] calldata proof_c,
        uint256[] calldata publicInputs
    ) external view override returns (bool) {
        return _isValid;
    }
}