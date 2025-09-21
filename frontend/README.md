#   FRONTEND
1. Instala dependencias: `npm install`.
2. Copia `.env.local.example` a `.env.local` y ajusta `NEXT_PUBLIC_BACKEND_URL` y `NEXT_PUBLIC_PROVER_WASM_BASE`.
3. Asegúrate de que los artefactos WASM y ZKEY estén disponibles desde la URL configurada.
4. Ejecuta `npm run dev` y visita `http://localhost:3000`.

## Notas y advertencias
- Cargar `membership_final.zkey` en el navegador puede suponer riesgos de seguridad si la zkey contiene información sensible de setup. En PLONK la zkey contiene partes del trusted setup: para producción consulta modelos de despliegue seguros (prover en kioskos, prover appliance, o prover server con garantías de privacidad).
- SnarkJS en el navegador es pesado; para kioskos de bajo rendimiento es mejor usar el `prover-wasm` como servicio local (ejecutado en otro contenedor) y ofrecer un API ligero para pedir pruebas.
- Esta UI es intencionalmente minimal para acelerar pruebas de concepto. Se recomienda mejorar UX, accesibilidad y traducciones (es, quichua, etc.).