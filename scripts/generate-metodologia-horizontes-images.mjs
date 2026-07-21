import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const KIE_BASE_URL = 'https://api.kie.ai';
const apiKey = process.env.KIE_API_KEY;

if (!apiKey) {
  console.error('Falta KIE_API_KEY en el entorno. Ejecuta con: node --env-file=.env scripts/generate-metodologia-horizontes-images.mjs');
  process.exit(1);
}

const root = process.cwd();
const outputDir = path.join(root, 'public', 'imagenes-mindtec', 'generated', 'metodologia-horizontes');

const onlyFilter = process.argv
  .find((arg) => arg.startsWith('--only='))
  ?.slice('--only='.length)
  ?.split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const STYLE_PREFIX =
  'Realistic editorial corporate photography, natural lighting, shallow depth of field, ' +
  'color grade with deep navy blue ambient and shadow tones (#0B2B40 / #061C2B) and warm orange accent light (#F26522), ' +
  'no on-image text, no logos, no watermarks, high detail, photojournalistic, not futuristic, not illustrated, not 3D render. ' +
  'Composition rule: the main subject and richest visual detail must sit on the RIGHT half of the frame, ' +
  'the LEFT half of the frame must stay comparatively empty, dark, or softly out of focus (negative space) ' +
  'so a text card can be placed over the left side without covering the subject.';

const IMAGES = [
  {
    id: 'cover-horizontes',
    outFile: 'cover-horizontes',
    prompt:
      STYLE_PREFIX +
      'A Bolivian executive standing at a large window in a dim boardroom at dusk, looking out over a city skyline on the right side of the frame, ' +
      'clock and calendar subtly visible on a side table, conveying the weight of time-sensitive strategic decisions, left side of frame is dark empty wall.',
  },
  {
    id: 'intro-horizontes',
    outFile: 'intro-horizontes',
    prompt:
      STYLE_PREFIX +
      'Close-up of a consulting team in a discovery session, one consultant on the right side of the frame pointing at a printed timeline chart with three horizons marked, ' +
      'a laptop and notebook on the table, warm collaborative lighting, left side of frame is an out-of-focus empty office wall.',
  },
  {
    id: 'horizonte-7-dias',
    outFile: 'horizonte-7-dias',
    prompt:
      STYLE_PREFIX +
      'A researcher on the right side of the frame urgently checking a tablet with a price comparison chart while standing in a retail store aisle, sense of speed and immediacy, ' +
      'motion blur hints in the background, left side of frame is a dim empty aisle end.',
  },
  {
    id: 'horizonte-30-dias',
    outFile: 'horizonte-30-dias',
    prompt:
      STYLE_PREFIX +
      'A focus group moderator on the right side of the frame taking notes while observing participants through a one-way mirror in a market research facility, ' +
      'calm and analytical mood, left side of frame is a dark empty observation room wall.',
  },
  {
    id: 'horizonte-60-90-dias',
    outFile: 'horizonte-60-90-dias',
    prompt:
      STYLE_PREFIX +
      'A large printed map of Bolivia with regional markers and pins spread on a conference table, an analyst on the right side of the frame studying it with a laptop showing predictive charts, ' +
      'sense of national scale and long-term planning, left side of frame is a dark empty conference room.',
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createTask(prompt) {
  const body = { prompt, size: '3:2' };

  const res = await fetch(`${KIE_BASE_URL}/api/v1/gpt4o-image/generate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  const taskId = data?.data?.taskId;

  if (!res.ok || !taskId) {
    throw new Error(`No se pudo crear la tarea: ${JSON.stringify(data)}`);
  }

  return taskId;
}

async function pollTask(taskId) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    await sleep(5000);

    const res = await fetch(`${KIE_BASE_URL}/api/v1/gpt4o-image/record-info?taskId=${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await res.json();
    const status = data?.data?.status;

    if (status === 'SUCCESS') {
      const url = data?.data?.response?.resultUrls?.[0];
      if (!url) throw new Error(`Tarea exitosa pero sin resultUrls: ${JSON.stringify(data)}`);
      return url;
    }

    if (status === 'CREATE_TASK_FAILED' || status === 'GENERATE_FAILED') {
      throw new Error(`Generación fallida: ${data?.data?.failMsg ?? JSON.stringify(data)}`);
    }
  }

  throw new Error('Tiempo de espera agotado esperando la tarea');
}

async function downloadAndSave(url, outFile) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo descargar la imagen: HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  await fs.mkdir(outputDir, { recursive: true });
  const outPath = path.join(outputDir, `${outFile}.webp`);
  await sharp(buffer).webp({ quality: 82 }).toFile(outPath);

  return outPath;
}

async function main() {
  const items = onlyFilter ? IMAGES.filter((img) => onlyFilter.includes(img.id)) : IMAGES;

  if (items.length === 0) {
    console.error(`Ningún id coincide con --only=${onlyFilter?.join(',')}`);
    process.exit(1);
  }

  console.log(`Generando ${items.length} imagen(es)...\n`);

  const results = [];

  for (let i = 0; i < items.length; i += 1) {
    const img = items[i];
    const label = `[${i + 1}/${items.length}] ${img.id}`;

    try {
      console.log(`${label} creando tarea...`);
      const taskId = await createTask(img.prompt);

      console.log(`${label} taskId=${taskId} esperando resultado...`);
      const resultUrl = await pollTask(taskId);

      console.log(`${label} descargando y guardando...`);
      const outPath = await downloadAndSave(resultUrl, img.outFile);

      results.push({ id: img.id, status: 'OK', outPath });
      console.log(`${label} OK -> ${outPath}\n`);
    } catch (err) {
      results.push({ id: img.id, status: 'FAILED', error: err.message });
      console.error(`${label} FALLÓ: ${err.message}\n`);
    }
  }

  console.log('--- Resumen ---');
  for (const r of results) {
    console.log(`${r.status === 'OK' ? '✔' : '✘'} ${r.id}${r.status === 'FAILED' ? ` — ${r.error}` : ''}`);
  }

  const failed = results.filter((r) => r.status === 'FAILED');
  if (failed.length > 0) {
    console.log(`\n${failed.length} fallaron. Relanza con --only=${failed.map((f) => f.id).join(',')}`);
    process.exitCode = 1;
  }
}

main();
