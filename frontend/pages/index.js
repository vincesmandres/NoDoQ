import Link from 'next/link';


export default function Home() {
return (
<div style={{ maxWidth: 800, margin: '36px auto', fontFamily: 'system-ui, sans-serif' }}>
<h1>NoDo — Votacion local con ZK</h1>
<p>
Plataforma demo para votaciones locales usando Zero-Knowledge proofs (membership + nullifier).
</p>


<ul>
<li><Link href="/vote">Ir a votar (demo)</Link></li>
<li><a href="/admin">Panel admin (dev)</a></li>
</ul>


<hr />
<p>Notas: asegurate de tener el backend corriendo y los artefactos ZK disponibles en <code>/membership_js</code> (o configurar PROVER base).</p>
</div>
);
}