import path from 'node:path';
import { createTask, pollTask, downloadAndSave } from './lib/muapi-client.mjs';

const root = process.cwd();
const outputDir = path.join(root, 'public', 'imagenes-mindtec', 'generated', 'inteligencia-b2b', 'entregables');

const onlyFilter = process.argv
  .find((arg) => arg.startsWith('--only='))
  ?.slice('--only='.length)
  ?.split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const seedRef = process.argv
  .find((arg) => arg.startsWith('--seed-ref='))
  ?.slice('--seed-ref='.length);

const STYLE_PREFIX =
  'Realistic editorial corporate photography, natural lighting, shallow depth of field, ' +
  'color grade with deep navy blue ambient and shadow tones (#0B2B40 / #061C2B) and warm orange accent light (#F26522), ' +
  'no on-image text, no logos, no watermarks, high detail, photojournalistic, not futuristic, not illustrated, not 3D render. ';

// Card sits on the LEFT (ScrollStoryLeftNoCover) -> keep the subject on the right.
const LEFT_CARD_COMPOSITION =
  'Keep the main subject in the right two-thirds of the frame, leaving the left third relatively open. ';

/**
 * Narrative: a corporate director's office in Bolivia where an executive reviews
 * the market-intelligence deliverables that reach the Dirección General. Same
 * person and same office across frames via image-to-image chaining, each frame
 * introducing a different deliverable (dashboard, brief, competitive matrix,
 * alignment session).
 */
const IMAGES = [
  {
    id: 'intro',
    outFile: 'intro',
    chainStart: true,
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'A Bolivian corporate executive in his late 40s, of mestizo Andean features, dark hair, formal business attire, seated at a wide glass desk in a modern executive office in Bolivia, reviewing several printed reports and a laptop with a market dashboard on screen, confident and composed expression. Establishing wide shot of the executive office with a city skyline visible through the window.',
  },
  {
    id: 'item-01-dashboard',
    outFile: 'item-01-dashboard-control-mercado',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same executive and same office as the reference image, now leaning slightly toward his laptop screen which displays an interactive market-control dashboard with price simulation sliders, a geographic map of Bolivia with colored regional markers, and live segmentation charts, one hand near the trackpad as if adjusting a filter, focused engaged expression.',
  },
  {
    id: 'item-02-brief-riesgo',
    outFile: 'item-02-brief-riesgo-oportunidad',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same executive and same office as the reference image, now holding a concise three-page printed executive brief document with a bold risk-and-opportunity summary chart on the visible page, reading it closely with a pen in his other hand, as if underlining a key figure.',
  },
  {
    id: 'item-03-matriz-posicionamiento',
    outFile: 'item-03-matriz-posicionamiento-competitivo',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same executive as the reference image, now standing beside a large printed competitive-positioning matrix pinned on a glass wall in the same office, showing three competitor markers plotted on two axes with a highlighted attack-plan arrow, pointing at one of the markers with a confident, analytical gesture.',
  },
  {
    id: 'item-04-sesion-alineacion',
    outFile: 'item-04-sesion-alineacion-directorio',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same executive as the reference image, now standing at the head of a boardroom table in the same corporate office in Bolivia, presenting findings on a wall screen to a small group of blurred seated directors, gesturing toward the screen with an open hand, confident presenting posture.',
  },
];

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

    const referenceForThisCall = img.chainStart ? null : lastReferenceUrl;

    try {
      console.log(`${label} creando tarea...`);
      const taskId = await createTask(img.prompt, referenceForThisCall);

      console.log(`${label} taskId=${taskId} esperando resultado...`);
      const resultUrl = await pollTask(taskId);

      console.log(`${label} descargando y guardando...`);
      const outPath = await downloadAndSave(resultUrl, outputDir, img.outFile);

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
