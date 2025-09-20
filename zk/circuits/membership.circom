// Circom v2 circuit: comprueba pertenencia en un Merkle tree y genera/verifica nullifier
// Inputs privados: secret, parishId, epoch, pollId, pathElements[], pathIndices[]
// Inputs públicos: root, nullifier


pragma circom 2.0.0;


include "circomlib/poseidon.circom";


// Simple helper to compute Poseidon hash of two field elements
template Hash2() {
signal input in[2];
signal output out;


component p = Poseidon(2);
for (var i = 0; i < 2; i++) {
p.inputs[i] <== in[i];
}
out <== p.out;
}


// Poseidon hash of three items (used for nullifier: secret, epoch, pollId)
template Hash3() {
signal input in[3];
signal output out;


component p = Poseidon(3);
for (var i = 0; i < 3; i++) {
p.inputs[i] <== in[i];
}
out <== p.out;
}


// Merkle proof verifier of depth `DEPTH` using Poseidon hash
template MerklePath(DEPTH) {
signal input leaf; // private
signal input pathElements[DEPTH]; // private
signal input pathIndices[DEPTH]; // private bits (0/1)
signal input root; // public


signal output out; // should equal root


var cur = 0;
signal tmp[DEPTH+1];
tmp[0] <== leaf;


for (var i = 0; i < DEPTH; i++) {
// compute pairHash depending on pathIndices[i]
signal left;
signal right;
// If index bit == 0, current is left child
left <== (pathIndices[i] == 0) ? tmp[i] : pathElements[i];
right <== (pathIndices[i] == 0) ? pathElements[i] : tmp[i];


component h = Hash2();
h.in[0] <== left;
h.in[1] <== right;
tmp[i+1] <== h.out;


// Enforce pathIndices are boolean (0 or 1)
pathIndices[i] * (pathIndices[i] - 1) === 0; // boolean constraint
}
component main = MembershipNullifier(16);