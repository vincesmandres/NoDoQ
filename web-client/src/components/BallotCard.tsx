"use client";
import { useState } from "react";

export default function BallotCard() {
  const [choice, setChoice] = useState<string | null>(null);
  const options = ["Opción A", "Opción B", "Opción C"];

  return (
    <section className="card">
      <h2 style={{ marginTop: 0 }}>2) Selecciona tu opción</h2>

      <div style={{ display: "grid", gap: 12 }}>
        {options.map((o) => (
          <label
            key={o}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              padding: "10px",
              border: "1px solid #242a35",
              borderRadius: 12,
              cursor: "pointer",
              background: choice === o ? "#11161d" : "transparent",
            }}
          >
            <input
              type="radio"
              name="ballot"
              checked={choice === o}
              onChange={() => setChoice(o)}
            />
            {o}
          </label>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <button
          className="btn btn-primary"
          disabled={!choice}
          onClick={() => alert(`(demo) Elegiste: ${choice}`)}
        >
          Continuar
        </button>
      </div>
    </section>
  );
}
