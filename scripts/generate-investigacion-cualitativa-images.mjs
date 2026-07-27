import path from 'node:path';
import { createTask, pollTask, downloadAndSave } from './lib/muapi-client.mjs';

const root = process.cwd();
const outputDir = path.join(root, 'public', 'imagenes-mindtec', 'generated', 'investigacion-cualitativa');

const onlyFilter = process.argv
  .find((arg) => arg.startsWith('--only='))
  ?.slice('--only='.length)
  ?.split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// Permite continuar una cadena narrativa ya iniciada, pasando la resultUrl
// (válida ~20 min) de la última imagen generada en una corrida anterior.
const seedRef = process.argv
  .find((arg) => arg.startsWith('--seed-ref='))
  ?.slice('--seed-ref='.length);

const STYLE_PREFIX =
  'Realistic editorial corporate photography, natural lighting, shallow depth of field, ' +
  'color grade with deep navy blue ambient and shadow tones (#0B2B40 / #061C2B) and warm orange accent light (#F26522), ' +
  'no on-image text, no logos, no watermarks, high detail, photojournalistic, not futuristic, not illustrated, not 3D render. ';

const LEFT_CARD_COMPOSITION = 'Keep the main subject in the right two-thirds of the frame, leaving the left third relatively open. ';
const RIGHT_CARD_COMPOSITION = 'Keep the main subject in the left two-thirds of the frame, leaving the right third relatively open. ';

/**
 * "entregable" images: card sits on the LEFT (ScrollStoryLeft) -> subject on the right.
 * "proceso" images: card sits on the RIGHT (ScrollStory) -> subject on the left.
 * Each frame (except the two covers) references the previous frame's generated image
 * via filesUrl so the same protagonists/office carry through the whole sequence.
 */
const IMAGES = [
  // ---------- ENTREGABLES ----------
  {
    id: 'entregables-cover',
    outFile: 'entregables-cover',
    chainStart: true,
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'A female market research analyst in her early 30s, business casual attire, sitting at her office desk reviewing a freshly printed final research report, ' +
      'surrounded by color-coded sticky notes and printed charts. Establishing shot that introduces her and her office.',
  },
  {
    id: 'entregables-intro',
    outFile: 'entregables-intro',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same woman, same desk and office as the reference image, now binding and packaging the printed dossier for delivery, a closing gesture, same outfit and lighting continuity.',
  },
  {
    id: 'entregable-01',
    outFile: 'entregable-01-mapa-motivaciones-barreras',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same woman as the reference image, now standing in front of a wall covered in an affinity map of color-coded sticky notes in the same office, arranging and organizing them during a qualitative analysis session.',
  },
  {
    id: 'entregable-02',
    outFile: 'entregable-02-decodificacion-cultural',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same woman and same office as the reference image, now looking at a research wall with pinned field-photography references of Bolivian urban markets and Andean textile patterns, continuing the same analysis session.',
  },
  {
    id: 'entregable-03',
    outFile: 'entregable-03-territorios-marca',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same woman, same office as the reference image, now standing in front of a branding mood board with product packaging mockups and color swatches pinned up, continuing the same work session.',
  },
  {
    id: 'entregable-04',
    outFile: 'entregable-04-evaluacion-conceptos',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same woman as the reference image, joined by a male colleague from the same team, both at the same table reviewing printed packaging concept boards and product mockups together.',
  },
  {
    id: 'entregable-05',
    outFile: 'entregable-05-grabaciones-transcripciones',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'Same woman, back at her original desk as in the first reference image, wearing headphones, reviewing session recordings and transcript documents on her laptop, notebook beside her.',
  },
  {
    id: 'entregable-06',
    outFile: 'entregable-06-brief-estrategico',
    prompt:
      STYLE_PREFIX +
      LEFT_CARD_COMPOSITION +
      'The same woman and her male colleague from the reference image, both gathered around the table reviewing a printed strategic brief document together, same office, closing scene of the sequence.',
  },
  // ---------- PROCESO ----------
  {
    id: 'proceso-cover',
    outFile: 'proceso-cover',
    chainStart: true,
    prompt:
      STYLE_PREFIX +
      RIGHT_CARD_COMPOSITION +
      'A male research consultant in his late 30s, business casual attire, and a female client in a meeting room, seated around a table with a whiteboard in the background showing a simple 4-step process outline. Establishing shot introducing both protagonists and the room.',
  },
  {
    id: 'proceso-intro',
    outFile: 'proceso-intro',
    prompt:
      STYLE_PREFIX +
      RIGHT_CARD_COMPOSITION +
      'Same two people and same meeting room as the reference image, now in a closer, more informal kickoff conversation, coffee cups and a notebook on the table between them.',
  },
  {
    id: 'proceso-01',
    outFile: 'proceso-01-diagnostico-pregunta',
    prompt:
      STYLE_PREFIX +
      RIGHT_CARD_COMPOSITION +
      'Same male consultant as the reference image, now standing and writing a research question on the same whiteboard seen in the background of the earlier scene, in the same meeting room.',
  },
  {
    id: 'proceso-02',
    outFile: 'proceso-02-diseno-metodologico-reclutamiento',
    prompt:
      STYLE_PREFIX +
      RIGHT_CARD_COMPOSITION +
      'Same male consultant as the reference image, now seated at the same meeting room table, reviewing printed participant profile sheets and recruitment screening criteria.',
  },
  {
    id: 'proceso-03',
    outFile: 'proceso-03-ejecucion-analisis-tiempo-real',
    prompt:
      STYLE_PREFIX +
      RIGHT_CARD_COMPOSITION +
      'Scene shifts to a focus group research room with the same color grading, the same male consultant now moderating a small group discussion with participants, a female colleague analyst monitoring notes on a laptop in the background.',
  },
  {
    id: 'proceso-04',
    outFile: 'proceso-04-sintesis-presentacion-estrategica',
    prompt:
      STYLE_PREFIX +
      RIGHT_CARD_COMPOSITION +
      'The same male consultant and the female client from the first reference image, now in a boardroom, the consultant presenting printed insight slides while the client and executives listen, closing scene of the sequence.',
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

    // Cada chainStart (portada de una sección nueva) rompe la cadena de referencia:
    // no debe heredar visualmente el elenco/espacio de la sección anterior.
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
