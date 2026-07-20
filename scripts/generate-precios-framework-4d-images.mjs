import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const KIE_BASE_URL = 'https://api.kie.ai';
const apiKey = process.env.KIE_API_KEY;

if (!apiKey) {
  console.error('Falta KIE_API_KEY en el entorno. Ejecuta con: node --env-file=.env scripts/generate-precios-framework-4d-images.mjs');
  process.exit(1);
}

const root = process.cwd();
const outputDir = path.join(root, 'public', 'imagenes-mindtec', 'generated', 'estudio-de-precios-4d');
const referenceImagePath = path.join(root, 'scripts', 'references', 'estudio-de-precios-protagonista.jpg');

const onlyFilter = process.argv
  .find((arg) => arg.startsWith('--only='))
  ?.slice('--only='.length)
  ?.split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const STYLE_PREFIX =
  'Realistic editorial corporate photography, natural lighting, shallow depth of field, ' +
  'color grade with deep navy blue ambient and shadow tones (#0B2B40 / #061C2B) and warm orange accent light (#F26522), ' +
  'no on-image text, no logos, no watermarks, high detail, photojournalistic, not futuristic, not illustrated, not 3D render. ';

// ScrollStory (not ScrollStoryLeft) is used for this section, so the text card
// docks on the RIGHT side of the screen -> the photo subject must stay in the
// LEFT two-thirds of the frame so it never sits behind the card.
const RIGHT_CARD_COMPOSITION = 'Keep the main subject in the left two-thirds of the frame, leaving the right third relatively open. ';

/**
 * Protagonista: la misma joven investigada de la imagen de referencia
 * (headset EEG, sosteniendo un envase de jugo de naranja con etiqueta de
 * precio en blanco), participante de una sesión de neuro-pricing.
 * Cada frame (salvo la portada) encadena la imagen anterior vía filesUrl
 * para mantener consistencia visual del elenco y del set.
 */
const IMAGES = [
  {
    id: 'cover',
    outFile: 'cover',
    chainStart: true,
    useSeedReference: true,
    prompt:
      STYLE_PREFIX +
      RIGHT_CARD_COMPOSITION +
      'A young Bolivian woman research participant in her mid-20s, dark hair, wearing a wireless EEG headset with electrode sensors, seated in a modern neuromarketing lab, holding a colorful orange juice carton with a blank price label and looking at it thoughtfully. In the soft out-of-focus background, a female researcher in business casual attire monitors a live biometric readout on a laptop screen. Establishing shot introducing her as the test participant in a neuro-pricing session.',
  },
  {
    id: 'intro',
    outFile: 'intro',
    prompt:
      STYLE_PREFIX +
      RIGHT_CARD_COMPOSITION +
      'Same woman and same neuromarketing lab as the reference image, now the female researcher carefully calibrating and adjusting the electrode headset on her before the test begins, both focused, a warm collaborative moment, laptop with brainwave software visible on the desk.',
  },
  {
    id: 'item-01-elasticidad',
    outFile: 'item-01-elasticidad-sensibilidad',
    prompt:
      STYLE_PREFIX +
      RIGHT_CARD_COMPOSITION +
      'Same woman as the reference image, still wearing the EEG headset, now looking down at a small table with four printed price-tag cards showing different price points for the same product, comparing them with a slightly furrowed, evaluating expression, same lab setting.',
  },
  {
    id: 'item-02-auditoria',
    outFile: 'item-02-auditoria-campo-canales',
    prompt:
      STYLE_PREFIX +
      RIGHT_CARD_COMPOSITION +
      'Scene shifts to a supermarket aisle with the same color grading. A field auditor in a polo shirt, holding a tablet, photographs and logs the shelf price tag of an orange juice product next to competitor brands, real retail environment, natural light, shallow depth of field.',
  },
  {
    id: 'item-03-dolor-de-pago',
    outFile: 'item-03-dolor-de-pago',
    prompt:
      STYLE_PREFIX +
      RIGHT_CARD_COMPOSITION +
      'Same woman as the reference image, close-up shot, still wearing the EEG headset, reacting with a subtle wince of discomfort as a price is revealed on a small screen in front of her, the researcher\'s monitor softly visible in the background showing a spike on a biometric graph, same lab.',
  },
  {
    id: 'item-04-psicoantropologica',
    outFile: 'item-04-estructura-psicoantropologica',
    prompt:
      STYLE_PREFIX +
      RIGHT_CARD_COMPOSITION +
      'The same female researcher from the calibration scene, now in a bright office meeting room, presenting a printed strategic pricing report to two attentive colleagues around a table, a page showing a simple pricing framework diagram, closing scene of the sequence.',
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function uploadSeedReference() {
  const buffer = await fs.readFile(referenceImagePath);
  const { format } = await sharp(buffer).metadata();
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const base64Data = `data:${mimeType};base64,${buffer.toString('base64')}`;

  const res = await fetch('https://kieai.redpandaai.co/api/file-base64-upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      base64Data,
      uploadPath: 'images/estudio-de-precios-4d',
      fileName: 'estudio-de-precios-protagonista.jpg',
    }),
  });

  const data = await res.json();
  const url = data?.data?.downloadUrl ?? data?.data?.fileUrl;

  if (!res.ok || !url) {
    throw new Error(`No se pudo subir la imagen de referencia: ${JSON.stringify(data)}`);
  }

  return url;
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

  console.log('Subiendo imagen de referencia de la protagonista...');
  const seedUrl = await uploadSeedReference();
  console.log(`Referencia subida -> ${seedUrl}\n`);

  console.log(`Generando ${items.length} imagen(es)...\n`);

  const results = [];
  let lastReferenceUrl = null;

  for (let i = 0; i < items.length; i += 1) {
    const img = items[i];
    const label = `[${i + 1}/${items.length}] ${img.id}`;

    const referenceForThisCall = img.useSeedReference ? seedUrl : lastReferenceUrl;

    try {
      console.log(`${label} creando tarea...`);
      const taskId = await createTask(img.prompt, referenceForThisCall);

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
