# tools\prune_repo.ps1
$ErrorActionPreference = "Stop"

# 1) mover web-client -> app (si existiera)
if (Test-Path "web-client") {
  git mv web-client app
}

# 2) eliminar backend si existe (MVP web3-first)
if (Test-Path "backend") {
  git rm -r --cached backend 2>$null
  Remove-Item -Recurse -Force backend
}

# 3) crear carpetas mínimas
New-Item -ItemType Directory -Force -Path zk\circuits | Out-Null
New-Item -ItemType Directory -Force -Path zk\build    | Out-Null
New-Item -ItemType Directory -Force -Path zk\scripts  | Out-Null
New-Item -ItemType Directory -Force -Path contracts\src | Out-Null
New-Item -ItemType Directory -Force -Path app\src\lib | Out-Null

# 4) .gitkeep para asegurar estructura
New-Item -ItemType File -Force -Path zk\circuits\.gitkeep | Out-Null
New-Item -ItemType File -Force -Path zk\build\.gitkeep    | Out-Null
New-Item -ItemType File -Force -Path contracts\src\.gitkeep | Out-Null
New-Item -ItemType File -Force -Path app\src\lib\.gitkeep | Out-Null

# 5) README mínimo si no existe
if (-not (Test-Path "README.md")) {
@"
# NoDoQ — ZK Voting (Semaphore-style)
MVP web3-first para ZKMonk: anonimato + unicidad (nullifier), verificación on-chain EVM.
- zk/: circuitos y build (wasm, zkey, vkey)
- contracts/: Verifier + NoDoAnchor
- app/: Next.js UI (MetaMask + 'cara' Sui opcional)

## Quickstart
pnpm i
pnpm zk:compile
pnpm contracts:build
pnpm contracts:deploy --network <testnet>
pnpm app:dev
"@ | Set-Content -Encoding UTF8 README.md
}

Write-Host "✅ Poda y estructura listas."
