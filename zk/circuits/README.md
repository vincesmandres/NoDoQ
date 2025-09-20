# Contenido: instrucciones y notas


# Carpeta `circuits` — NoDo (Membership + Nullifier)


Esta carpeta contiene el circuito principal `membership.circom` que verifica:
- que una credencial (leaf) pertenece a un Merkle root público del padrón de la parroquia,
- que el votante genera un `nullifier = Poseidon(secret, epoch, pollId)` que se expone públicamente
y evita doble voto.


## Archivos
- `membership.circom` — circuito principal (usa Poseidon para hashing y verifica un Merkle path de profundidad 16).
- `inputs/example_input.json` — ejemplo de entrada para pruebas locales.
- `build.sh` — script para compilar circuito y generar archivos necesarios (snarkjs).
- `generate_proof_and_witness.js` — ejemplo de script Node.js para generar witness + proof.


## Requisitos
- circom v2
- snarkjs
- node >= 16


## Flujo de desarrollo rápido
1. `bash build.sh` — compilar el circuito y generar zkey (para desarrollo).
2. Editar `inputs/example_input.json` con valores reales (usar herramientas para construir Merkle path).
3. `node generate_proof_and_witness.js` — generar witness y prueba (ajustar según versión de snarkjs).
4. Verificar prueba localmente (snarkjs plonk verify ...).


## Notas y advertencias
- En producción: la generación del ptau (trusted setup) debe realizarse siguiendo buenas prácticas de múltiples contribuyentes.
- El depth del Merkle tree (actualmente 16) debe ajustarse según número de entradas del padrón.
- La conversión entre identificadores civiles a `secret` debe diseñarse para no incluir PII en el circuito: derive `secret` en backend y entregar al usuario dentro de una VC segura.