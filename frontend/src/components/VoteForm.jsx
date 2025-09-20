import { useState } from "react";
import { motion } from "framer-motion";

const parroquias = [
  "Belisario Quevedo",
  "Carcelén",
  "Centro Histórico",
  "Chilibulo",
  "Chillogallo",
  "Chimbacalle",
  "Cochapamba",
  "Comité del Pueblo",
  "Concepción",
  "Cotocollao",
  "El Condado",
  "El Inca",
  "Guamaní",
  "Iñaquito",
  "Itchimbía",
  "Jipijapa",
  "Kennedy",
  "La Argelia",
  "La Ecuatoriana",
  "La Ferroviaria",
  "La Libertad",
  "La Mena",
  "Magdalena",
  "Mariscal Sucre",
  "Ponceano",
  "Puengasí",
  "Quitumbe",
  "Rumipamba",
  "San Bartolo",
  "San Juan",
  "Solanda",
];

export default function VoteForm({ onVote }) {
  const [cedula, setCedula] = useState("");
  const [parroquia, setParroquia] = useState("");
  const [choice, setChoice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cedula || cedula.length !== 10) {
      alert("⚠️ Ingresa una cédula válida de 10 dígitos.");
      return;
    }
    if (!parroquia) {
      alert("⚠️ Selecciona una parroquia.");
      return;
    }
    if (!choice) {
      alert("⚠️ Selecciona un candidato.");
      return;
    }

    onVote(cedula, parroquia, choice);
    setCedula("");
    setParroquia("");
    setChoice("");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Cedula */}
      <input
        type="number"
        className="w-full p-3 border-2 border-blue-400 rounded-xl shadow-md text-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
        placeholder="Ingresa tu número de cédula"
        value={cedula}
        onChange={(e) => setCedula(e.target.value)}
      />

      {/* Parroquia */}
      <select
        className="w-full p-3 border-2 border-green-400 rounded-xl shadow-md text-lg focus:outline-none focus:ring-4 focus:ring-green-300"
        value={parroquia}
        onChange={(e) => setParroquia(e.target.value)}
      >
        <option value="">Selecciona tu parroquia</option>
        {parroquias.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {/* Candidato */}
      <select
        className="w-full p-3 border-2 border-purple-400 rounded-xl shadow-md text-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
        value={choice}
        onChange={(e) => setChoice(e.target.value)}
      >
        <option value="">Selecciona tu candidato</option>
        <option value="Candidato A 🟢">Candidato A 🟢</option>
        <option value="Candidato B 🔵">Candidato B 🔵</option>
        <option value="Candidato C 🔴">Candidato C 🔴</option>
      </select>

      <motion.button
        type="submit"
        className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-2 rounded-xl shadow-lg transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
      >
        Votar 🗳️
      </motion.button>
    </motion.form>
  );
}
