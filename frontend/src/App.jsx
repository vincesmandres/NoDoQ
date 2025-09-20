import { useState } from "react";
import { motion } from "framer-motion";
import VoteForm from "./components/VoteForm";

export default function App() {
  const [greeting, setGreeting] = useState("Bienvenido a las Votaciones de Quito");

  // Estado de votos
  const [votes, setVotes] = useState({
    "Candidato A 🟢": 0,
    "Candidato B 🔵": 0,
    "Candidato C 🔴": 0,
  });

  // Registro de cédulas que ya votaron
  const [voters, setVoters] = useState({});

  const handleVote = (cedula, parroquia, candidate) => {
    if (voters[cedula]) {
      setGreeting(`⚠️ La cédula ${cedula} ya ha votado.`);
      return;
    }

    // Registrar voto
    setVotes((prev) => ({
      ...prev,
      [candidate]: prev[candidate] + 1,
    }));

    // Marcar cédula como usada
    setVoters((prev) => ({
      ...prev,
      [cedula]: { parroquia, candidate },
    }));

    setGreeting(
      `✅ Voto registrado para ${candidate} desde la parroquia ${parroquia}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <motion.h1
        className="text-5xl font-extrabold text-white drop-shadow-lg mb-10 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        🗳️ Votaciones On-Chain Ecuador <br />
        <span className="text-yellow-200">Votaciones para Alcalde</span>
      </motion.h1>

      {/* Card principal */}
      <motion.div
        className="w-full max-w-3xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 flex flex-col items-center">
          <p className="text-xl text-gray-700 font-medium mb-6 text-center">
            {greeting}
          </p>

          <VoteForm onVote={handleVote} />

          {/* Resultados en tiempo real */}
          <div className="mt-8 w-full">
            <h2 className="text-2xl font-bold text-purple-700 text-center mb-4">
              📊 Resultados en tiempo real
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(votes).map(([candidate, count]) => (
                <motion.div
                  key={candidate}
                  className="bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 p-4 rounded-xl shadow-md text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-lg font-semibold">{candidate}</p>
                  <p className="text-3xl font-bold text-purple-800">{count}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="mt-10 text-white text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
      </motion.footer>
    </div>
  );
}
