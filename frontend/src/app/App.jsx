import { useState } from "react-is";
import VoteForm from "../components/VoteForm";

export default function App() {
  return (
    <div className="p-4">
      <h1>Votaciones Comunitarias con MACI</h1>
      <VoteForm />
    </div>
  );
}
