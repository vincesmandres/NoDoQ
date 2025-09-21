"use client";
import { useState } from "react";

export default function ResultsCard() {
  const [receiptHash, setReceiptHash] = useState<string | null>(null);

  const handleAnchor = async () => {
    // Próxima fase: invocar anchor(...) en Sui.
    setReceiptHash("0xRECEIPT_HASH_DEMO");
  };

  return (
    <section className="card">
      <h2 style={{ marginTop: 0 }}>4) Auditar</h2>
      <p>Anchora el recibo para trazabilidad pública.</p>
      <button className="btn btn-primary" onClick={handleAnchor}>Anclar (demo)</button>
      {receiptHash && <p style={{ marginTop: 10 }}>Receipt: {receiptHash}</p>}
    </section>
  );
}
