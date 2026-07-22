import path from 'node:path';
import { createTask, pollTask, downloadAndSave } from './lib/muapi-client.mjs';

const root = process.cwd();
const outputDir = path.join(root, 'public', 'imagenes-mindtec', 'generated', 'auditoria-retail-cuando-auditar');

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

// Card sits on the LEFT (ScrollStoryLeft) -> keep main subject in the right
// two-thirds of the frame, leaving the left third relatively open.
const LEFT_CARD_COMPOSITION = 'Keep the main subject in the right two-thirds of the frame, leaving the left third relatively open. ';

const IMAGES = [
  {
    id: 'cover',
    outFile: 'cover',
    chainStart: true,
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'A retail field auditor in business-casual attire, holding a tablet, standing attentively in a supermarket aisle in Bolivia, looking down the aisle with a focused, alert expression as if noticing something wrong with the shelf execution. Establishing wide shot of the aisle with shelves full of consumer products.',
  },
  {
    id: 'intro',
    outFile: 'intro',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same auditor and same supermarket aisle as the reference image, now closer, reviewing a checklist on the tablet with visible red warning flags on the screen, cross-referencing it against the shelf in front.',
  },
  {
    id: 'item-01-descalce-estancamiento',
    outFile: 'item-01-descalce-estancamiento',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same auditor as the reference image, now standing near a checkout counter, holding a printed internal compliance report showing "100%" next to the tablet displaying a flat, stagnant sales chart, a visible contradiction between the paperwork and the real numbers.',
  },
  {
    id: 'item-02-fiscalizacion-acuerdos',
    outFile: 'item-02-fiscalizacion-acuerdos',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same auditor as the reference image, now photographing a branded end-cap promotional display and gondola-head island in a different aisle of the same supermarket, inspecting whether the paid premium display space was properly installed.',
  },
  {
    id: 'item-03-perdida-espacio-rival',
    outFile: 'item-03-perdida-espacio-rival',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same auditor as the reference image, now standing in front of a shelf where a competing brand visibly occupies significantly more shelf space than before, holding a printed planogram sheet up to compare against the real shelf layout.',
  },
  {
    id: 'item-04-roi-material-pop',
    outFile: 'item-04-roi-material-pop',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same auditor as the reference image, now in a small supermarket back stockroom, discovering a stack of unused branded POP promotional danglers and banners that were never installed on the shop floor, tablet in hand documenting the finding.',
  },
  {
    id: 'item-05-expansion-geografica',
    outFile: 'item-05-expansion-geografica',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same auditor as the reference image, now inside a smaller, modest neighborhood store in a secondary Bolivian city, verifying the shelf placement of a newly launched product, tablet raised to photograph the shelf, a visibly more modest retail setting than the earlier metropolitan supermarket.',
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
