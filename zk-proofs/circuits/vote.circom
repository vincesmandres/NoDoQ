template Vote() {
    signal input vote;
    signal output out;
    out <== vote * 1;
}

component main = Vote();
