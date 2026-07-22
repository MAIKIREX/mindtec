import path from 'node:path';
import { createTask, pollTask, downloadAndSave } from './lib/muapi-client.mjs';

const root = process.cwd();
const outputDir = path.join(root, 'public', 'imagenes-mindtec', 'generated', 'firma-estandares');

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

// El componente ScrollStory (firma.astro, Sección 3) posiciona:
// - cover: texto superpuesto abajo-izquierda (ancho ~80vw) -> mantener sujeto arriba/derecha.
// - intro: tarjeta ancha ocupando el ~60% inferior de pantalla -> mantener sujeto en el tercio superior.
// - items: tarjeta angosta pegada al borde derecho (~48% ancho, ~82% alto) -> mantener sujeto en los dos tercios izquierdos.
const TOP_SAFE_COMPOSITION =
  'A wide horizontal card covers the bottom 60% of this image, so keep the main subject and action in the top third of the frame. ';
const BOTTOM_LEFT_SAFE_COMPOSITION =
  'Text will overlay the bottom-left area of this image, so keep the main subject centered and toward the upper-right two-thirds of the frame, leaving the bottom-left corner relatively open and darker. ';
const LEFT_SAFE_COMPOSITION =
  'A narrow tall card is docked to the right edge of this image, covering roughly the right half, so keep the main subject and action in the left two-thirds of the frame, leaving the right third relatively open. ';

/**
 * Storyboard para la Sección 3 de firma.astro (Estándares Operativos).
 * Misma identidad visual encadenada vía filesUrl para coherencia de luz/color,
 * pero cada imagen ilustra específicamente lo que dice su tarjeta.
 */
const IMAGES = [
  {
    id: 'cover',
    outFile: 'cover-adn-corporativo',
    prompt:
      STYLE_PREFIX +
      BOTTOM_LEFT_SAFE_COMPOSITION +
      'A senior corporate leadership team (four people, mixed gender, formal business attire, 40s-50s) in a strategic ' +
      'planning session inside a modern executive meeting room, gathered around a table with printed reports and a laptop, ' +
      'serious and focused expressions, warm evening light through large windows. Establishing shot of institutional rigor.',
  },
  {
    id: 'intro',
    outFile: 'intro-confidencialidad',
    prompt:
      STYLE_PREFIX +
      TOP_SAFE_COMPOSITION +
      'Two executives in a private boardroom having a discreet closed-door conversation, one signing a confidentiality ' +
      'agreement document, blinds partially closed, low warm lighting conveying discretion and trust, composed in the upper part of the frame.',
  },
  {
    id: 'item-01',
    outFile: 'item-01-rigor-evidencia',
    prompt:
      STYLE_PREFIX +
      LEFT_SAFE_COMPOSITION +
      'A data analyst in her 30s at a desk cross-checking a printed statistical report against a monitor showing data ' +
      'tables and a trend chart, pen in hand annotating numbers, concentrated expression conveying methodical rigor and traceability.',
  },
  {
    id: 'item-02',
    outFile: 'item-02-validacion-campo',
    prompt:
      STYLE_PREFIX +
      LEFT_SAFE_COMPOSITION +
      'A field researcher with a clipboard and lanyard auditing a small neighborhood retail store in Bolivia, checking ' +
      'shelf displays and product placement against a checklist, shopkeeper visible in the background, natural daylight through the storefront.',
  },
  {
    id: 'item-03',
    outFile: 'item-03-entregables-accion',
    prompt:
      STYLE_PREFIX +
      LEFT_SAFE_COMPOSITION +
      'An executive presenting an executive dashboard on a large screen to two colleagues in a meeting room, screen showing ' +
      'clear charts and a roadmap with milestones, hand gesturing toward a highlighted action point, confident collaborative atmosphere.',
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

    try {
      console.log(`${label} creando tarea...`);
      const taskId = await createTask(img.prompt, lastReferenceUrl);

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
