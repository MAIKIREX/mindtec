const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const metric1 = `\n                                <div style="margin-top:1rem; font-weight:700; color:var(--color-primary); font-size:1rem; display:flex; gap:6px;"><span style="color:var(--color-secondary);">→</span> Más de 80 encuestadores activos en 4+ ciudades</div>`;
const metric2 = `\n                                <div style="margin-top:1rem; font-weight:700; color:var(--color-primary); font-size:1rem; display:flex; gap:6px;"><span style="color:var(--color-secondary);">→</span> Primera y única firma con laboratorio de neuromarketing operativo en Bolivia</div>`;
const metric3 = `\n                                <div style="margin-top:1rem; font-weight:700; color:var(--color-primary); font-size:1rem; display:flex; gap:6px;"><span style="color:var(--color-secondary);">→</span> Entrega promedio: 7 a 21 días según complejidad</div>`;

content = content.replace(/(<strong>Red Nacional de Inteligencia de Campo<\/strong>[\s\S]*?<\/p>)/, `$1${metric1}`);
content = content.replace(/(<strong>Integración de IA y Neuromarketing<\/strong>[\s\S]*?<\/p>)/, `$1${metric2}`);
content = content.replace(/(<strong>Análisis diseñado para la Gerencia<\/strong>[\s\S]*?<\/p>)/, `$1${metric3}`);

// Fijando el typo causado por el rebalanceo de "fear-marketing"
content = content.replace(/Dejaremos las suposiciones de lado para validar oportunidades reales en el terreno en su lugar para auditar lo que\s*\*realmente\*\s*está pasando\./g, 
  "Dejamos las suposiciones de lado para validar con evidencia metódica en campo lo que realmente determina la decisión del consumidor final.");

fs.writeFileSync('index.html', content);
console.log("Metrics injected and typo fixed");
