import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const postsDir = path.join(root, 'src', 'content', 'posts');
const publicDir = path.join(root, 'public');
const outputDir = path.join(publicDir, 'imagenes-mindtec', 'blog-covers-v2');
const width = 1200;
const height = 675;

const categoryMeta = {
  'Neuromarketing': {
    accent: '#f26522',
    chips: ['EEG', 'Eye Tracking', 'Emocion'],
  },
  'Investigación de Mercados': {
    accent: '#2aa7c9',
    chips: ['Campo', 'Insight', 'Estrategia'],
  },
  'InvestigaciÃ³n de Mercados': {
    accent: '#2aa7c9',
    chips: ['Campo', 'Insight', 'Estrategia'],
  },
  'Psicoantropología': {
    accent: '#8b5cf6',
    chips: ['Cultura', 'Codigo', 'Impronta'],
  },
  'PsicoantropologÃ­a': {
    accent: '#8b5cf6',
    chips: ['Cultura', 'Codigo', 'Impronta'],
  },
  'Neuroventas': {
    accent: '#22c55e',
    chips: ['Deseo', 'Decision', 'Retorno'],
  },
  'Lenguaje Corporal': {
    accent: '#ef4444',
    chips: ['Gesto', 'Tension', 'Contexto'],
  },
};

const originalImages = {
  '3-ejemplos-de-neuromarketing-en-la-vida-diaria-que-quiza-no-sabias': '/imagenes-mindtec/3-ejemplos-de-neuro.jpg',
  '5-tips-diferenciar-tu-marca': '/imagenes-mindtec/5-tips-de-neuromarketing.jpg',
  'codigo-cultural': '/imagenes-mindtec/codigo-cultural-1.jpg',
  'como-emocionar-a-mis-clientes': '/imagenes-mindtec/emocionar-cliente.png',
  'conoce-las-5c-del-neuromarketing-y-potenciate': '/imagenes-mindtec/5c-neuromarketing.png',
  'diferencias-hombres-y-mujeres-al-comprar-i': '/imagenes-mindtec/post-diferencia-hombres.png',
  'eres-capaz-de-descubrir-mentiras-de-tu-cliente-aprende-como-hacerlo-parte-i': '/imagenes-mindtec/descubre-mentiras.jpg',
  'fidelizar_cliente': '/imagenes-mindtec/posts-fidelizar.png',
  'herramientas-recoleccion-datos-cualitativos': '/imagenes-mindtec/Portada-herramientas-recoleccion-datos-cualitativos.jpg',
  'investigacion-de-mercado-en-bolivia-consumer-behavior': '/imagenes-mindtec/mercado-bolivia.jpg',
  'investigacion-de-mercado-en-pymes-paso-a-paso': '/imagenes-mindtec/inv-mer.jpg',
  'investigacion-de-mercados-con-neuromarketing': '/imagenes-mindtec/investigacion-de-mercados.jpg',
  'investigacion-de-mercados-consumidor': '/imagenes-mindtec/invest-mercados.jpg',
  'investigacion-de-mercados-cuantitativa-vs-cualitativa': '/imagenes-mindtec/investigacion-de-mercados.jpg',
  'mente_del_consumidor': '/imagenes-mindtec/consumidor.jpg',
  'por-que-utilizar-neuromarketing-en-mi-publicidad': '/imagenes-mindtec/postspor-que.jpg',
  'publicidad-efectiva-en-tu-campana-como-saber-si-lo-sera': '/imagenes-mindtec/publi-efectiva.jpg',
  'que-es-el-neuromarketing': '/imagenes-mindtec/que-es-el-neuro.png',
  'sabes-la-diferencia-entre-marketing-de-emociones-y-neuromarketing': '/imagenes-mindtec/emociones-neuromarketing.jpg',
};

function getFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1] || '';
}

function getField(frontmatter, field) {
  const match = frontmatter.match(new RegExp(`^${field}:\\s*["']?(.+?)["']?\\s*$`, 'm'));
  return match?.[1]?.replace(/^["']|["']$/g, '').trim();
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapText(text, maxChars = 29, maxLines = 3) {
  const clean = text
    .replace(/\s*\([^)]{7,}\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = clean.split(' ');
  const lines = [];
  let line = '';

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
    if (lines.length === maxLines) break;
  }

  if (line && lines.length < maxLines) lines.push(line);
  if (words.join(' ').length > lines.join(' ').length) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/[.,;:!?-]+$/g, '');
  }
  return lines;
}

function buildOverlay({ title, category, accent, chips }) {
  const titleLines = wrapText(title);
  const titleTspans = titleLines
    .map((line, index) => `<tspan x="72" dy="${index === 0 ? 0 : 62}">${escapeXml(line)}</tspan>`)
    .join('');

  const chipMarkup = chips
    .map((chip, index) => {
      const x = 72 + index * 142;
      return `
        <rect x="${x}" y="556" width="122" height="36" rx="18" fill="rgba(255,255,255,0.11)" stroke="rgba(255,255,255,0.18)" />
        <text x="${x + 61}" y="579" text-anchor="middle" font-size="15" font-weight="800" fill="#ffffff">${escapeXml(chip)}</text>
      `;
    })
    .join('');

  const nodes = Array.from({ length: 18 }, (_, index) => {
    const x = 670 + ((index * 73) % 460);
    const y = 88 + ((index * 97) % 470);
    const r = 2.5 + (index % 4);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${accent}" opacity="${0.32 + (index % 3) * 0.12}" />`;
  }).join('');

  const lines = Array.from({ length: 16 }, (_, index) => {
    const x1 = 650 + ((index * 83) % 470);
    const y1 = 96 + ((index * 59) % 470);
    const x2 = 670 + (((index + 4) * 71) % 460);
    const y2 = 92 + (((index + 2) * 103) % 470);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${accent}" stroke-width="1.2" opacity="0.16" />`;
  }).join('');

  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="veil" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#071927" stop-opacity="0.96"/>
          <stop offset="0.48" stop-color="#0b2b40" stop-opacity="0.80"/>
          <stop offset="1" stop-color="#071927" stop-opacity="0.25"/>
        </linearGradient>
        <radialGradient id="glow" cx="72%" cy="38%" r="58%">
          <stop offset="0" stop-color="${accent}" stop-opacity="0.36"/>
          <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
        </radialGradient>
        <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#ffffff" stroke-opacity="0.055" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="1200" height="675" fill="url(#veil)"/>
      <rect width="1200" height="675" fill="url(#glow)"/>
      <rect width="1200" height="675" fill="url(#grid)"/>
      <g>${lines}${nodes}</g>
      <path d="M72 96 H238" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>
      <text x="72" y="148" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" letter-spacing="3" fill="${accent}">${escapeXml(category.toUpperCase())}</text>
      <text x="72" y="254" font-family="Arial, Helvetica, sans-serif" font-size="55" font-weight="900" fill="#ffffff" letter-spacing="-1">${titleTspans}</text>
      <text x="72" y="500" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="700" fill="rgba(255,255,255,0.72)">Insight aplicado al consumidor boliviano</text>
      ${chipMarkup}
      <g transform="translate(934 72)">
        <rect x="0" y="0" width="194" height="54" rx="27" fill="rgba(7,25,39,0.62)" stroke="rgba(255,255,255,0.18)" />
        <circle cx="31" cy="27" r="12" fill="${accent}" />
        <text x="58" y="33" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="900" fill="#ffffff" letter-spacing="1.4">MINDTEC</text>
      </g>
    </svg>
  `);
}

async function generate() {
  await fs.mkdir(outputDir, { recursive: true });
  const files = (await fs.readdir(postsDir)).filter((file) => file.endsWith('.md'));

  for (const file of files) {
    const postPath = path.join(postsDir, file);
    const source = await fs.readFile(postPath, 'utf8');
    const frontmatter = getFrontmatter(source);
    const title = getField(frontmatter, 'title');
    const category = getField(frontmatter, 'category') || 'Neuromarketing';
    const img = getField(frontmatter, 'img');
    if (!title || !img) continue;

    const slug = path.basename(file, '.md');
    const sourceImg = originalImages[slug] || img;
    const inputPath = path.join(publicDir, sourceImg.replace(/^\//, ''));
    const outputName = `${slug}-cover-v2.webp`;
    const outputPath = path.join(outputDir, outputName);
    const meta = categoryMeta[category] || categoryMeta['Neuromarketing'];

    const base = await sharp(inputPath)
      .resize(width, height, { fit: 'cover', position: 'attention' })
      .modulate({ saturation: 0.78, brightness: 0.78 })
      .blur(0.3)
      .toBuffer();

    await sharp(base)
      .composite([{ input: buildOverlay({ title, category, ...meta }), blend: 'over' }])
      .webp({ quality: 86, effort: 5 })
      .toFile(outputPath);

    const nextImg = `/imagenes-mindtec/blog-covers-v2/${outputName}`;
    const updated = source.replace(/^img:\s*["']?.+?["']?\s*$/m, `img: "${nextImg}"`);
    await fs.writeFile(postPath, updated, 'utf8');
    console.log(`${file} -> ${nextImg}`);
  }
}

generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
