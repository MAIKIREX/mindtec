import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const outDir = path.join(root, 'public', 'imagenes-mindtec', 'service-visuals-v2');
const width = 1400;
const height = 920;

const visuals = [
  {
    slug: 'catalogo',
    eyebrow: 'MAPA DE SOLUCIONES',
    title: 'Research + Intelligence + Retail + Strategy',
    accent: '#f26522',
    labels: ['Decisión', 'Evidencia', 'Servicio', 'Activación'],
    metrics: [86, 74, 91, 68],
    nodes: ['Research', 'Intelligence', 'Retail', 'Strategy'],
    footer: 'Arquitectura de servicios conectada a decisiones de negocio',
  },
  {
    slug: 'neuromarketing',
    eyebrow: 'LABORATORIO NEURO',
    title: 'Atención, emoción y memoria medibles',
    accent: '#f26522',
    labels: ['Mirada', 'Carga', 'Emoción', 'Memoria'],
    metrics: [92, 63, 78, 71],
    nodes: ['Eye tracking', 'EEG', 'GSR', 'Facial coding'],
    footer: 'Validación científica antes de invertir en campaña o empaque',
  },
  {
    slug: 'mercado',
    eyebrow: 'VIABILIDAD COMERCIAL',
    title: 'TAM / SAM / SOM + riesgo de entrada',
    accent: '#2aa7c9',
    labels: ['TAM', 'SAM', 'SOM', 'Riesgo'],
    metrics: [81, 66, 44, 58],
    nodes: ['Demanda', 'Canal', 'Competencia', 'Stop / Go'],
    footer: 'Modelo visual para defender inversión ante directorio',
  },
  {
    slug: 'precios',
    eyebrow: 'NEURO PRICING',
    title: 'Precio óptimo sin sacrificar margen',
    accent: '#22c55e',
    labels: ['Margen', 'Valor', 'Dolor', 'Elasticidad'],
    metrics: [84, 73, 48, 62],
    nodes: ['Rango bajo', 'Zona óptima', 'Punto crítico', 'Pérdida'],
    footer: 'Sensibilidad de precio, valor percibido y umbrales de pago',
  },
  {
    slug: 'marca',
    eyebrow: 'MAPA PERCEPTUAL',
    title: 'Promesa, reputación y confianza',
    accent: '#8b5cf6',
    labels: ['Confianza', 'Diferencia', 'Lealtad', 'Precio'],
    metrics: [79, 54, 72, 61],
    nodes: ['Percibido', 'Deseado', 'Brecha', 'Reposicionar'],
    footer: 'Diagnóstico para proteger reputación y evitar competir solo por precio',
  },
  {
    slug: 'retail',
    eyebrow: 'TRADE INTELLIGENCE',
    title: 'Ejecución real en punto de venta',
    accent: '#f26522',
    labels: ['Shelf', 'Precio', 'Stock', 'POP'],
    metrics: [76, 69, 57, 82],
    nodes: ['Foto + GPS', 'Alerta', 'Ruta', 'Corrección'],
    footer: 'Evidencia georreferenciada para cerrar brechas de ejecución',
  },
  {
    slug: 'shopper',
    eyebrow: 'SHOPPER JOURNEY',
    title: 'Lo que el comprador ve y decide',
    accent: '#f26522',
    labels: ['Entrada', 'Comparación', 'Impulso', 'Cierre'],
    metrics: [71, 86, 64, 78],
    nodes: ['Recorrido', 'Anaquel', 'Competidor', 'Compra'],
    footer: 'Lectura del comportamiento real frente a góndola',
  },
  {
    slug: 'focus',
    eyebrow: 'CUALITATIVO PROFUNDO',
    title: 'Del diálogo grupal al código cultural',
    accent: '#2aa7c9',
    labels: ['Lenguaje', 'Tensión', 'Consenso', 'Insight'],
    metrics: [80, 58, 69, 88],
    nodes: ['Moderación', 'Relatos', 'Patrones', 'Decisión'],
    footer: 'Análisis de discurso, símbolos y contradicciones útiles',
  },
  {
    slug: 'benchmarking',
    eyebrow: 'RADAR COMPETITIVO',
    title: 'Movimientos de mercado y espacios de ataque',
    accent: '#ef4444',
    labels: ['Precio', 'Canal', 'Mensaje', 'Brecha'],
    metrics: [74, 82, 67, 59],
    nodes: ['Observar', 'Comparar', 'Detectar', 'Atacar'],
    footer: 'Inteligencia competitiva para anticipar y diferenciarse',
  },
  {
    slug: 'misterioso',
    eyebrow: 'EXPERIENCIA AUDITADA',
    title: 'Servicio real medido sin sesgo interno',
    accent: '#22c55e',
    labels: ['Saludo', 'Venta', 'Servicio', 'Cierre'],
    metrics: [73, 61, 84, 57],
    nodes: ['Visita', 'Evidencia', 'Hallazgo', 'Mejora'],
    footer: 'Cliente misterioso con trazabilidad y plan de acción',
  },
];

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function polar(cx, cy, radius, angle) {
  const rad = (angle - 90) * Math.PI / 180;
  return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
}

function arcPath(cx, cy, radius, start, end) {
  const [sx, sy] = polar(cx, cy, radius, end);
  const [ex, ey] = polar(cx, cy, radius, start);
  const largeArc = end - start <= 180 ? 0 : 1;
  return `M ${sx} ${sy} A ${radius} ${radius} 0 ${largeArc} 0 ${ex} ${ey}`;
}

function buildSvg(item) {
  const bars = item.metrics.map((value, index) => {
    const y = 528 + index * 68;
    return `
      <text x="102" y="${y + 20}" class="label">${esc(item.labels[index])}</text>
      <rect x="270" y="${y}" width="382" height="16" rx="8" fill="rgba(255,255,255,0.12)" />
      <rect x="270" y="${y}" width="${Math.round(382 * value / 100)}" height="16" rx="8" fill="${item.accent}" />
      <text x="680" y="${y + 20}" class="metric">${value}%</text>
    `;
  }).join('');

  const arcs = item.metrics.map((value, index) => {
    const radius = 138 - index * 27;
    const end = Math.max(16, value * 3.05);
    return `<path d="${arcPath(1050, 430, radius, 0, end)}" fill="none" stroke="${item.accent}" stroke-width="14" stroke-linecap="round" opacity="${0.96 - index * 0.13}" />`;
  }).join('');

  const nodes = item.nodes.map((node, index) => {
    const coords = [
      [858, 654],
      [1048, 595],
      [1228, 654],
      [1048, 760],
    ][index];
    return `
      <g>
        <circle cx="${coords[0]}" cy="${coords[1]}" r="8" fill="${item.accent}" />
        <rect x="${coords[0] - 72}" y="${coords[1] + 18}" width="144" height="34" rx="17" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.16)" />
        <text x="${coords[0]}" y="${coords[1] + 40}" text-anchor="middle" class="node">${esc(node)}</text>
      </g>
    `;
  }).join('');

  const connectors = `
    <path d="M866 654 C940 600 980 590 1040 595" class="connector"/>
    <path d="M1056 595 C1128 592 1172 618 1220 654" class="connector"/>
    <path d="M1220 662 C1166 728 1118 756 1056 760" class="connector"/>
    <path d="M1040 760 C970 746 912 716 866 662" class="connector"/>
  `;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="72%" cy="28%" r="58%">
          <stop offset="0" stop-color="${item.accent}" stop-opacity="0.42"/>
          <stop offset="1" stop-color="${item.accent}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#123b55"/>
          <stop offset="1" stop-color="#061927"/>
        </linearGradient>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1"/>
        </pattern>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="#020617" flood-opacity="0.28"/>
        </filter>
        <style>
          .eyebrow { font: 900 22px Arial, Helvetica, sans-serif; letter-spacing: 5px; fill: ${item.accent}; }
          .title { font: 900 58px Arial, Helvetica, sans-serif; fill: #fff; letter-spacing: -1px; }
          .subtitle { font: 700 24px Arial, Helvetica, sans-serif; fill: rgba(255,255,255,0.72); }
          .label { font: 800 23px Arial, Helvetica, sans-serif; fill: #fff; }
          .metric { font: 900 24px Arial, Helvetica, sans-serif; fill: ${item.accent}; }
          .node { font: 800 17px Arial, Helvetica, sans-serif; fill: #fff; }
          .small { font: 700 20px Arial, Helvetica, sans-serif; fill: rgba(255,255,255,0.78); }
          .connector { fill: none; stroke: rgba(255,255,255,0.22); stroke-width: 2; stroke-dasharray: 9 10; }
        </style>
      </defs>
      <rect width="${width}" height="${height}" fill="#071927"/>
      <rect width="${width}" height="${height}" fill="url(#glow)"/>
      <rect width="${width}" height="${height}" fill="url(#grid)"/>
      <g filter="url(#shadow)">
        <rect x="64" y="64" width="1272" height="792" rx="28" fill="rgba(255,255,255,0.055)" stroke="rgba(255,255,255,0.12)"/>
      </g>
      <path d="M102 112 H284" stroke="${item.accent}" stroke-width="7" stroke-linecap="round"/>
      <text x="102" y="178" class="eyebrow">${esc(item.eyebrow)}</text>
      <text x="102" y="282" class="title">${esc(item.title.split(' ').slice(0, 5).join(' '))}</text>
      <text x="102" y="348" class="title">${esc(item.title.split(' ').slice(5).join(' '))}</text>
      <text x="102" y="430" class="subtitle">${esc(item.footer)}</text>
      <rect x="82" y="486" width="660" height="306" rx="20" fill="rgba(255,255,255,0.075)" stroke="rgba(255,255,255,0.12)" />
      ${bars}
      <g>
        <circle cx="1050" cy="430" r="170" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.12)"/>
        <circle cx="1050" cy="430" r="70" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.14)"/>
        ${arcs}
        <text x="1050" y="419" text-anchor="middle" class="metric">LIVE</text>
        <text x="1050" y="452" text-anchor="middle" class="small">decision data</text>
      </g>
      <g>${connectors}${nodes}</g>
      <g transform="translate(1110 104)">
        <rect width="162" height="48" rx="24" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.16)" />
        <circle cx="28" cy="24" r="11" fill="${item.accent}" />
        <text x="51" y="31" class="node" style="font-size:18px;letter-spacing:2px">MINDTEC</text>
      </g>
    </svg>
  `;
}

async function run() {
  await fs.mkdir(outDir, { recursive: true });

  for (const item of visuals) {
    const out = path.join(outDir, `${item.slug}-service-visual-v2.webp`);
    await sharp(Buffer.from(buildSvg(item)))
      .webp({ quality: 88, effort: 5 })
      .toFile(out);
    console.log(out);
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
