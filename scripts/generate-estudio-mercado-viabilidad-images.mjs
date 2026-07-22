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
  'Realistic editorial corporate photography, natural lighting, shallow depth of field, ' +
  'color grade with deep navy blue ambient and shadow tones (#0B2B40 / #061C2B) and warm orange accent light (#F26522), ' +
  'no on-image text, no logos, no watermarks, high detail, photojournalistic, not futuristic, not illustrated, not 3D render. ';

// Card sits on the LEFT (ScrollStoryLeft) -> keep the subject on the right.
const LEFT_CARD_COMPOSITION = 'Keep the main subject in the right two-thirds of the frame, leaving the left third relatively open. ';

/**
 * Narrative: a market-viability "war room" where an analyst reviews a large glass
 * data wall. Each frame focuses on a different abstract data visualization on that
 * wall, echoing the 4 dimensions of Mindtec's viability model. Subjects and props
 * stay consistent across frames via image-to-image chaining (filesUrl).
 */
const IMAGES = [
  {
    id: 'cover',
    outFile: 'cover',
    chainStart: true,
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'A focused business analyst in her late 30s, business casual attire, standing in a dim glass-walled office, looking at a large glass data wall covered in abstract financial charts, concentric circular market-sizing diagrams and layered translucent panels glowing in orange and navy tones. Establishing wide shot introducing her and the room.',
  },
  {
    id: 'intro',
    outFile: 'intro',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same analyst and same glass data wall as the reference image, now closer, pointing at a cluster of four distinct abstract data panels arranged side by side on the glass wall, as if comparing four different dimensions of analysis.',
  },
  {
    id: 'item-01-arquitectura-financiera',
    outFile: 'item-01-arquitectura-financiera',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same glass data wall and office as the reference image, now filling the frame with a close-up of concentric translucent circles of decreasing size (three nested rings) glowing in orange and navy light, representing layered market-sizing data, faint grid lines behind them, the analyst blurred in the foreground.',
  },
  {
    id: 'item-02-validacion-demanda',
    outFile: 'item-02-validacion-demanda',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same glass data wall and office as the reference image, now a close-up of a dense abstract heatmap of small glowing orange and navy dots of varying intensity clustered unevenly across the glass panel, suggesting hidden patterns in behavior data, analyst blurred in the background.',
  },
  {
    id: 'item-03-inteligencia-competitiva',
    outFile: 'item-03-inteligencia-competitiva',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same glass data wall and office as the reference image, now a close-up of an abstract radar-style network diagram with several glowing orange nodes connected by thin navy lines at different distances from a central point, representing competitor mapping, analyst blurred in the background.',
  },
  {
    id: 'item-04-stop-go',
    outFile: 'item-04-stop-go',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same glass data wall and office as the reference image, now a close-up of two large translucent panels side by side, one glowing warm orange and one glowing deep navy, meeting at a sharp dividing line like a fork, representing a binary strategic decision, analyst blurred in the background reaching toward the panels.',
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
