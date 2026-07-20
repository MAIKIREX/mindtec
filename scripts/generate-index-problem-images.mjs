import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const KIE_BASE_URL = 'https://api.kie.ai';
const apiKey = process.env.KIE_API_KEY;

if (!apiKey) {
  console.error('Falta KIE_API_KEY en el entorno. Ejecuta con: node --env-file=.env scripts/generate-index-problem-images.mjs');
  process.exit(1);
}

const root = process.cwd();
const outputDir = path.join(root, 'public', 'imagenes-mindtec', 'generated', 'index-problem');

const onlyFilter = process.argv
  .find((arg) => arg.startsWith('--only='))
  ?.slice('--only='.length)
  ?.split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// Permite continuar/retomar una cadena ya iniciada pasando la resultUrl
// (válida ~20 min) de la última imagen generada en una corrida anterior.
const seedRef = process.argv
  .find((arg) => arg.startsWith('--seed-ref='))
  ?.slice('--seed-ref='.length);

const STYLE_PREFIX =
  'Realistic editorial corporate photography, natural lighting, shallow depth of field, ' +
  'color grade with deep navy blue ambient and shadow tones (#0B2B40 / #061C2B) and warm orange accent light (#F26522), ' +
  'no on-image text, no logos, no watermarks, high detail, photojournalistic, not futuristic, not illustrated, not 3D render. ';

const TOP_SAFE_COMPOSITION =
  'A wide horizontal card covers the bottom 60% of this image, so keep the main subject and action in the top third of the frame. ';
const RIGHT_SAFE_COMPOSITION = 'Keep the main subject in the right two-thirds of the frame, leaving the left third relatively open. ';
const LEFT_SAFE_COMPOSITION = 'Keep the main subject in the left two-thirds of the frame, leaving the right third relatively open. ';
const RIGHT_THIRD_SAFE = 'Keep the main subject in the right two-thirds of the frame, leaving the far right third relatively open. ';
const LEFT_THIRD_SAFE = 'Keep the main subject in the left two-thirds of the frame, leaving the far left third relatively open. ';

/**
 * Storyboard: a female commercial/marketing director confronts, one after another,
 * decisions made without enough evidence. Same protagonist across all 8 frames,
 * chained via filesUrl so her face/outfit stay consistent through the sequence.
 * Composition alternates per this page's card layout: cover (text bottom-left) ->
 * subject top/right, intro (wide bottom card) -> subject top third, items alternate
 * left/right card position -> subject opposite third.
 */
const IMAGES = [
  {
    id: 'cover',
    outFile: 'cover',
    prompt:
      STYLE_PREFIX +
      RIGHT_THIRD_SAFE +
      'A female commercial/marketing director in her 40s, business attire, alone in her office late at night, desk lamp light, ' +
      'looking pensively at printed reports and a laptop, expression of quiet concern about a costly decision. Establishing shot introducing her and her office.',
  },
  {
    id: 'intro',
    outFile: 'intro',
    prompt:
      STYLE_PREFIX +
      TOP_SAFE_COMPOSITION +
      'Same woman as the reference image, now standing and observing a market research session in progress through an observation window, ' +
      'analysts and a participant visible in the room beyond the glass, her figure and the scene composed in the upper part of the frame.',
  },
  {
    id: 'item-01',
    outFile: 'item-01-lanzamiento',
    prompt:
      STYLE_PREFIX +
      RIGHT_SAFE_COMPOSITION +
      'Same woman as the reference image, now on a retail store floor reviewing a new product launch display on the shelf, ' +
      'uncertain expression, holding a tablet or clipboard.',
  },
  {
    id: 'item-02',
    outFile: 'item-02-pricing',
    prompt:
      STYLE_PREFIX +
      LEFT_SAFE_COMPOSITION +
      'Same woman as the reference image, now analyzing printed price tags and a pricing curve chart at a store counter, calculating expression.',
  },
  {
    id: 'item-03',
    outFile: 'item-03-percepcion-marca',
    prompt:
      STYLE_PREFIX +
      RIGHT_SAFE_COMPOSITION +
      'Same woman as the reference image, now standing in front of a research wall covered with brand perception boards and consumer feedback notes, studying them closely.',
  },
  {
    id: 'item-04',
    outFile: 'item-04-expansion-territorial',
    prompt:
      STYLE_PREFIX +
      LEFT_SAFE_COMPOSITION +
      'Same woman as the reference image, now leaning over a large regional expansion map spread on a table, pointing at a highlighted territory.',
  },
  {
    id: 'item-05',
    outFile: 'item-05-market-share',
    prompt:
      STYLE_PREFIX +
      RIGHT_SAFE_COMPOSITION +
      'Same woman as the reference image, now reviewing a competitive market-share dashboard with a declining trend line on a laptop screen, concerned expression.',
  },
  {
    id: 'item-06',
    outFile: 'item-06-shopper-positioning',
    prompt:
      STYLE_PREFIX +
      LEFT_SAFE_COMPOSITION +
      'Same woman as the reference image, now discreetly observing a real shopper browsing a store shelf from a short distance, ' +
      'studying the shopper\'s behavior.',
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createTask(prompt, referenceUrl) {
  const body = { prompt, size: '3:2' };
  if (referenceUrl) {
    body.filesUrl = [referenceUrl];
  }

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
  let lastReferenceUrl = seedRef ?? null;

  for (let i = 0; i < items.length; i += 1) {
    const img = items[i];
    const label = `[${i + 1}/${items.length}] ${img.id}`;

    try {
      console.log(`${label} creando tarea...`);
      const taskId = await createTask(img.prompt, lastReferenceUrl);

      console.log(`${label} taskId=${taskId} esperando resultado...`);
      const resultUrl = await pollTask(taskId);

      console.log(`${label} descargando y guardando...`);
      const outPath = await downloadAndSave(resultUrl, img.outFile);

      lastReferenceUrl = resultUrl;
      results.push({ id: img.id, status: 'OK', outPath });
      console.log(`${label} OK -> ${outPath}\n`);
    } catch (err) {
      results.push({ id: img.id, status: 'FAILED', error: err.message });
      console.error(`${label} FALLÓ: ${err.message}\n`);
      // sigue con la cadena usando la última referencia exitosa conocida
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
