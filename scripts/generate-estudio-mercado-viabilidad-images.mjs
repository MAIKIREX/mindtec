import path from 'node:path';
import { createTask, pollTask, downloadAndSave } from './lib/muapi-client.mjs';

const root = process.cwd();
const outputDir = path.join(root, 'public', 'imagenes-mindtec', 'generated', 'estudio-mercado-viabilidad');

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
  'Realistic editorial corporate photography, shot on a full-frame DSLR with a natural warm window light source, ' +
  'true-to-life color grade with deep navy blue shadow tones (#0B2B40 / #061C2B) and a warm amber accent light (#F26522) picked up on skin and surfaces, ' +
  'authentic unposed moment, real physical objects and printed paper only (no glowing screens, no holographic overlays, no on-screen dashboards, no floating UI graphics), ' +
  'no on-image text, no logos, no watermarks, high detail, photojournalistic, documentary style, not futuristic, not illustrated, not 3D render. ';

// Card sits on the LEFT (ScrollStoryLeft) -> keep the subject on the right.
const LEFT_CARD_COMPOSITION = 'Keep the main subject and any props in the right two-thirds of the frame, leaving the left third relatively open and uncluttered. ';

/**
 * Narrative: real, grounded moments across Mindtec's market-viability process —
 * from the analyst's desk to the actual retail floor — echoing the 4 dimensions
 * of the viability model without resorting to abstract sci-fi data-wall visuals.
 * Each frame is generated independently (no image-to-image chaining) so every
 * scene can live in its own real, concrete location.
 */
const IMAGES = [
  {
    id: 'cover',
    outFile: 'cover',
    chainStart: true,
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'A focused business analyst in her late 30s, business casual attire, seated at a wooden desk in a bright office with large windows, golden late-afternoon light streaming in, reviewing a printed market feasibility report and a spread of paper charts, a laptop closed beside her, a soft city skyline visible through the window behind her.',
  },
  {
    id: 'intro',
    outFile: 'intro',
    chainStart: true,
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Two colleagues, a woman and a man in business casual attire, standing at a wooden conference table in a naturally lit office, comparing four printed report sections spread out side by side on the table, one of them pointing at a page, warm daylight through large windows.',
  },
  {
    id: 'item-01-arquitectura-financiera',
    outFile: 'item-01-arquitectura-financiera',
    chainStart: true,
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Close-up over-the-shoulder shot of a business analyst\'s hand pointing with a pen at a printed diagram of three concentric circles of decreasing size labeled as a market-sizing chart, resting on a wooden desk next to a coffee cup and a notebook, warm natural window light, shallow depth of field.',
  },
  {
    id: 'item-02-validacion-demanda',
    outFile: 'item-02-validacion-demanda',
    chainStart: true,
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Candid, authentic photo inside a small traditional Bolivian neighborhood store, a real customer\'s hand reaching to pick up a packaged product from a crowded shelf, warm natural daylight coming through the storefront, shallow depth of field, genuine everyday shopping moment, no posing.',
  },
  {
    id: 'item-03-inteligencia-competitiva',
    outFile: 'item-03-inteligencia-competitiva',
    chainStart: true,
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'A field auditor in casual field clothing discreetly holding up a smartphone to photograph a competitor\'s product display on a retail store shelf, aisle softly lit by natural store lighting, shallow depth of field, candid documentary moment.',
  },
  {
    id: 'item-04-stop-go',
    outFile: 'item-04-stop-go',
    chainStart: true,
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'A small group of three executives in business attire around a boardroom table in a naturally lit meeting room, one of them pointing decisively at a highlighted line on a one-page printed executive brief, engaged and serious body language, warm window light, shallow depth of field.',
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
