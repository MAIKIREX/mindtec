import path from 'node:path';
import { createTask, pollTask, downloadAndSave } from './lib/muapi-client.mjs';

const root = process.cwd();
const outputDir = path.join(root, 'public', 'imagenes-mindtec', 'generated', 'cliente-misterioso', 'entregables');

const onlyFilter = process.argv
  .find((arg) => arg.startsWith('--only='))
  ?.slice('--only='.length)
  ?.split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const STYLE_PREFIX =
  'Realistic editorial corporate photography, shot on a full-frame DSLR with natural window or storefront light, ' +
  'true-to-life color grade with deep navy blue shadow tones (#0B2B40 / #061C2B) and a warm amber accent light (#F26522) picked up on skin and surfaces, ' +
  'the people in the photo are Bolivian, with Andean mestizo features, warm brown skin tones and dark hair, dressed in realistic Bolivian business-casual or retail attire, ' +
  'authentic unposed moment, real physical printed documents only (no glowing screens, no holographic overlays, no on-screen dashboards, no floating UI graphics), ' +
  'no on-image text, no logos, no watermarks, high detail, photojournalistic, documentary style, not futuristic, not illustrated, not 3D render. ';

// This ScrollStory's card slides in from the RIGHT -> keep the subject on the left.
const RIGHT_CARD_COMPOSITION = 'Keep the main subject and any props in the left two-thirds of the frame, leaving the right third relatively open and uncluttered. ';

/**
 * Narrative: real, grounded moments from Mindtec's mystery-shopper / PDV
 * experience audit deliverables — reviewing printed journey maps, scorecards,
 * benchmarks and briefs — with Bolivian people, in Bolivian retail/office
 * settings, avoiding abstract sci-fi dashboard visuals.
 */
const IMAGES = [
  {
    id: 'cover',
    outFile: 'entregables-cover',
    prompt:
      STYLE_PREFIX +
      RIGHT_CARD_COMPOSITION +
      'A Bolivian business analyst in her late 30s, business casual attire, standing in a bright modern office with large windows, warm afternoon light, reviewing a printed customer-experience audit report held in her hands, a wooden desk with more printed pages visible in the background.',
  },
  {
    id: 'intro',
    outFile: 'entregables-intro',
    prompt:
      STYLE_PREFIX +
      RIGHT_CARD_COMPOSITION +
      'Two Bolivian colleagues, a woman and a man in business casual attire, standing at a wooden table in a naturally lit office, comparing six printed report sections spread out side by side on the table, one of them pointing at a page, warm daylight through large windows.',
  },
  {
    id: 'item-01-mapa-experiencia',
    outFile: 'entregable-01-mapa-experiencia',
    prompt:
      STYLE_PREFIX +
      RIGHT_CARD_COMPOSITION +
      'Close-up over-the-shoulder shot of a Bolivian analyst\'s hand pointing with a pen at a large printed customer journey map taped to a wall, showing a path with labeled stops from entrance to checkout, warm natural window light, shallow depth of field.',
  },
  {
    id: 'item-02-scorecard-locales',
    outFile: 'entregable-02-scorecard-locales',
    prompt:
      STYLE_PREFIX +
      RIGHT_CARD_COMPOSITION +
      'A Bolivian regional retail manager in business casual attire, seated at a wooden desk in a bright office, reviewing a printed scorecard sheet ranking several store locations, a pen in hand marking a row, warm natural daylight through a window behind her.',
  },
  {
    id: 'item-03-benchmark-competencia',
    outFile: 'entregable-03-benchmark-competencia',
    prompt:
      STYLE_PREFIX +
      RIGHT_CARD_COMPOSITION +
      'A Bolivian field auditor in casual field clothing at a cafe table, laying two printed store-audit sheets side by side for comparison, one labeled with his own client\'s store photos and the other with a competitor\'s store photos, warm natural daylight, shallow depth of field.',
  },
  {
    id: 'item-04-brief-activacion',
    outFile: 'entregable-04-brief-activacion',
    prompt:
      STYLE_PREFIX +
      RIGHT_CARD_COMPOSITION +
      'A Bolivian store manager briefing a younger Bolivian sales associate inside a real retail store aisle, both looking down at a printed one-page action brief the manager is holding, warm natural store lighting, candid documentary moment.',
  },
  {
    id: 'item-05-executive-brief',
    outFile: 'entregable-05-executive-brief',
    prompt:
      STYLE_PREFIX +
      RIGHT_CARD_COMPOSITION +
      'A Bolivian executive in business attire presenting a one-page printed executive brief to two colleagues around a boardroom table in a naturally lit meeting room, pointing at a highlighted line, engaged and serious body language, warm window light.',
  },
  {
    id: 'item-06-seguimiento',
    outFile: 'entregable-06-seguimiento',
    prompt:
      STYLE_PREFIX +
      RIGHT_CARD_COMPOSITION +
      'A Bolivian consultant and a Bolivian store manager standing together inside a retail store, both smiling and reviewing a printed follow-up checklist, warm natural store lighting, genuine collaborative moment, shallow depth of field.',
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

  for (let i = 0; i < items.length; i += 1) {
    const img = items[i];
    const label = `[${i + 1}/${items.length}] ${img.id}`;

    try {
      console.log(`${label} creando tarea...`);
      const taskId = await createTask(img.prompt, null);

      console.log(`${label} taskId=${taskId} esperando resultado...`);
      const resultUrl = await pollTask(taskId);

      console.log(`${label} descargando y guardando...`);
      const outPath = await downloadAndSave(resultUrl, outputDir, img.outFile);

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
