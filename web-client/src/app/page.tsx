"use client";
import LoginCard from "@/components/LoginCard";
import BallotCard from "@/components/BallotCard";
import ProofCard from "@/components/ProofCard";
import ResultsCard from "@/components/ResultsCard";

export default function Page() {
  return (
    <main className="grid">
      <LoginCard />
      <BallotCard />
      <ProofCard />
      <ResultsCard />
    </main>
  );
}
