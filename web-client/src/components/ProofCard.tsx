"use client";
import { useState } from "react";

export default function ProofCard() {
  const [pollId, setPollId] = useState("demo-poll-001");
  const [leaf, setLeaf] = useState("0x00");

  const handleProve = async () => {
    alert(`(mock) Generar prueba con pollId=${pollId} leaf=${leaf}`);
    // Próxima fase: llamar a un WebWorker con snarkjs.fullProve(...)
  };

  return (
    <section className="card">
      <h2 style={{ marginTop: 0 }}>3) Probar (ZK)</h2>
      <div style={{ display: "grid", gap: 8 }}>
        <label>
          Poll ID:
          <input className="input" value={pollId} onChange={(e) => setPollId(e.target.value)} />
        </label>
        <label>
          Leaf:
          <input className="input" value={leaf} onChange={(e) => setLeaf(e.target.value)} />
        </label>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
        <button className="btn btn-primary" onClick={handleProve}>Generar prueba</button>
      </div>
    </section>
  );
}
