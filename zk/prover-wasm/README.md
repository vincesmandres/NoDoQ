# NoDo — prover-wasm


Esta carpeta proporciona un pequeño prototipo para ejecutar el *prover* en el cliente usando el artefacto WASM generado por `circom`.


## Flujo rápido
1. Compilar circuito desde `/circuits` (ejecutar `bash circuits/build.sh`) — esto genera `circuits/build/membership_js` y `membership_final.zkey`.
2. Ejecutar `pnpm install` o `npm install` en `/prover-wasm`.
3. Ejecutar `npm run install-circuit-artifacts` para copiar los artefactos a `/prover-wasm/public`.
4. Iniciar el dev server: `npm run dev` y abrir `http://localhost:5173`.
5. Usar la UI para cargar `inputs/example_input.json` y generar una proof (fullProve) — el navegador descargará el wasm y zkey desde `/public` y ejecutará el prover.


## Notas
- En dispositivos de baja capacidad la generación de pruebas en el cliente puede ser lenta. Para kioskos recomendamos tablets con CPU decente o usar el script `make_proof_node.js` en un servidor local que actúe como "prover appliance" (con cuidadosa consideración de privacidad).
- En producción, la zkey no debería exponerse en el cliente si el esquema lo requiere; en PLONK el verificador está en la zkey derivada. Para maximizar seguridad considera mover la generación de prueba a dispositivos controlados o usar optimizaciones.