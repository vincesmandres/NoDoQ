module.exports = {
reactStrictMode: true,
env: {
NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000',
NEXT_PUBLIC_PROVER_WASM_BASE: process.env.NEXT_PUBLIC_PROVER_WASM_BASE || '/membership_js'
}
};