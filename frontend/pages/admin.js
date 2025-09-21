import { useEffect, useState } from 'react';
import axios from 'axios';


const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';


export default function Admin() {
const [batches, setBatches] = useState([]);


useEffect(() => {
// ejemplo: no hay endpoint admin en backend por defecto; this is placeholder
}, []);


return (
<div style={{ maxWidth: 900, margin: 32 }}>
<h2>Admin (dev)</h2>
<p>En el backend implementa endpoints admin para listar batches/votos si lo deseas.</p>
<pre>{JSON.stringify({ info: 'placeholder' }, null, 2)}</pre>
</div>
);
}