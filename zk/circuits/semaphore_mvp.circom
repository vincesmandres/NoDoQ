include "../node_modules/circomlib/circuits/poseidon.circom";

template Boolify(){
    signal input b;
    b*(b-1) === 0;
}

template Poseidon2(){
    signal input in[2];
    signal output out;

    component h = Poseidon(2);
    for (var i = 0; i <2; i++){
        h.inputs[i] <== in[i];
    }

    out <== h.out;
}

template MerkleProof(levels){
    signal input leaf;
    signal input pathElements[levels];
    signal input pathIndex[levels];
    signal output root;

    signal cur;
    cur <== leaf;

    for(var i=0; i<levels; i++){
        // Aseguramos que el Path si sea 0 y 1
        component bi = Boolify();
        bi.b <== pathIndex[i];

        // Selección para el Merklee y sus hijos
        signal left;
        signal right;

        left <== (1 - pathIndex[i])*cur + pathIndex[i]*pathElements[i];
        right <== pathIndex[i]*cur + (1 - pathIndex[i])*pathElements[i];

        // Hash del par para subir un nivel
        component h = Poseidon2();
        h.in[0] <== left;
        h.in[1] <== right;

        cur <== h.out;
    }
    root <== cur;
}

template SemaphoreMVP(levels) {

    signal input identity_secret;
    signal input pathElements[levels];
    signal input pathIndex[levels];

    signal input merkle_root;
    signal input external_nullifier;
    signal input sig;
    signal input nullifier_hash;
    signal input signal_binding;

    component leafH = Poseidon(1);
    leafH.inputs[0] <== identity_secret;
    signal leaf;
    leaf <== leafH.out;

    component mp = MerkleProof(levels);
    mp.leaf <== leaf;

    // cableamos los arrays de camino al subcircuito
    for (var i = 0; i < levels; i++) {
        mp.pathElements[i] <== pathElements[i];
        mp.pathIndex[i]    <== pathIndex[i];
    }

    // Restricción: la raíz reconstruida debe igualar la pública
    mp.root === merkle_root;  // "===" crea la ecuación de la prueba
    // Un nullifier es basicamente unicidad por eleccion, y asi
    // si se repite el nullifier, el verifier lo rechaza
    // Nullifier: evita doble voto por elección -----
    // nullifier_hash = Poseidon(identity_secret, external_nullifier)
    
    component nh = Poseidon(2);
    nh.inputs[0] <== identity_secret;
    nh.inputs[1] <== external_nullifier;
    nh.out === nullifier_hash; // fijamos que el público debe coincidir

    // Signal binding: liga el "signal" a tu secreto -----
    // Estructura: signal_binding = Poseidon(signal, identity_secret)
    component sb = Poseidon(2);
    sb.inputs[0] <== sig;
    sb.inputs[1] <== identity_secret;
    sb.out === signal_binding;
    // fijamos que el público debe coincidir
}

component main = SemaphoreMVP(20);