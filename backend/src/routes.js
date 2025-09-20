import { Router } from "express";

const router = Router();

// Ejemplo de endpoint para registro de votantes
router.post("/register", (req, res) => {
  const { cedula } = req.body;
  res.json({ message: `Votante ${cedula} registrado.` });
});

export default router;
