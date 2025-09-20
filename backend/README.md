# NoDo Backend

Backend para el proyecto NoDo. Provee:
- Endpoint para enviar votos con prueba ZK (verificación off-chain)
- Prevención de doble voto mediante nullifiers en Redis
- Persistencia de votos en Postgres
- Batch worker para anclar batches en contrato NoDoAnchor

## Quick start (dev)
1. Copia `.env.example` a `.env` y ajusta variables.
2. Instala dependencias:
   ```bash
   npm install
