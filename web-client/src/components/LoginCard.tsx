"use client";
import { ConnectButton } from "@mysten/dapp-kit";

export default function LoginCard() {
  return (
    <section className="card">
      <h2 style={{ marginTop: 0 }}>1) Entrar</h2>
      <p className="muted">Conéctate para comenzar (zkLogin llegará luego).</p>
      <ConnectButton />
    </section>
  );
}
