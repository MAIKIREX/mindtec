import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const KIE_BASE_URL = 'https://api.kie.ai';
const apiKey = process.env.KIE_API_KEY;

if (!apiKey) {
  console.error('Falta KIE_API_KEY en el entorno. Ejecuta con: node --env-file=.env scripts/generate-entregables-scrollstory-images.mjs');
  process.exit(1);
}

const root = process.cwd();

const sectionFilter = process.argv
  .find((arg) => arg.startsWith('--section='))
  ?.slice('--section='.length)
  ?.split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const onlyFilter = process.argv
  .find((arg) => arg.startsWith('--only='))
  ?.slice('--only='.length)
  ?.split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const STYLE_PREFIX =
  'Realistic editorial corporate photography, natural lighting, shallow depth of field, ' +
  'color grade with deep navy blue ambient and shadow tones (#0B2B40 / #061C2B) and warm orange accent light (#F26522), ' +
  'no on-image text, no real brand names or logos (use generic unlabeled or fictional abstract packaging/labels only), no watermarks, ' +
  'high detail, photojournalistic, not futuristic, not illustrated, not 3D render. ';

// ScrollStory (not Left) positions the card on the RIGHT side of the viewport
// -> keep the main subject in the left two-thirds of the frame, leaving the
// right third relatively open so the card never covers what matters.
const RIGHT_CARD_COMPOSITION =
  'Keep the main subject in the left two-thirds of the frame, leaving the right third relatively open. ';

const SECTIONS = [
  {
    id: 'benchmarking-competitivo',
    outputDir: path.join(root, 'public', 'imagenes-mindtec', 'generated', 'benchmarking-competitivo', 'entregables'),
    images: [
      {
        id: 'cover',
        outFile: 'entregables-cover',
        chainStart: true,
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'A business intelligence analyst in business-casual attire standing in front of a large war-room wall covered with pinned printed bar charts, line graphs, pie charts and numeric price tables (abstract data only, no product photography, no packaging, no bottles or logos of any kind), arms crossed, studying the board with a focused expression, modern office in Bolivia.',
      },
      {
        id: 'intro',
        outFile: 'entregables-intro',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same analyst as the reference image, now seated at a desk with a laptop open showing competitive comparison charts, cross-referencing the screen against the pinned board behind, same war-room office.',
      },
      {
        id: 'item-01-mapa-posicionamiento',
        outFile: 'entregable-01-mapa-posicionamiento',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same analyst as the reference image, now pinning small printed colored dots and labeled index cards (abstract data markers, no product images) onto a large positioning map on the wall with two axes (price vs. quality), marker in hand, mid-placement.',
      },
      {
        id: 'item-02-precios-canal',
        outFile: 'entregable-02-precios-canal',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same analyst as the reference image, now at a table covered with printed price comparison sheets from different retail channels, laptop beside showing a pricing bar chart, comparing the printed sheets side by side.',
      },
      {
        id: 'item-03-auditoria-pdv',
        outFile: 'entregable-03-auditoria-pdv',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same analyst as the reference image, now reviewing a tablet displaying a photo of an empty, unbranded supermarket aisle with plain grey placeholder shelf boxes (no visible products, packaging or logos), a few similar printed shelf-layout diagrams pinned on the board behind for comparison.',
      },
      {
        id: 'item-04-percepcion-consumidor',
        outFile: 'entregable-04-percepcion-consumidor',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same analyst as the reference image, now in a small meeting room reviewing a printed report with brand perception comparison charts and colored sticky notes on the pages, focused reading posture.',
      },
      {
        id: 'item-05-vulnerabilidades',
        outFile: 'entregable-05-vulnerabilidades',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same analyst as the reference image, now circling opportunity zones with a red marker on the large printed competitive map on the wall, mid-gesture, engaged expression.',
      },
      {
        id: 'item-06-brief-directorio',
        outFile: 'entregable-06-brief-directorio',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same analyst as the reference image, now standing at the head of a boardroom table presenting a polished printed strategic brief document to blurred seated executives, confident presenting posture.',
      },
    ],
  },
  {
    id: 'cliente-misterioso',
    outputDir: path.join(root, 'public', 'imagenes-mindtec', 'generated', 'cliente-misterioso', 'entregables'),
    images: [
      {
        id: 'cover',
        outFile: 'entregables-cover',
        chainStart: true,
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'A well-dressed ordinary-looking customer discreetly observing a retail sales interaction at a store counter in Bolivia, phone held low and casual, blending in as a normal shopper, candid unnoticed posture.',
      },
      {
        id: 'intro',
        outFile: 'entregables-intro',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same person as the reference image, now seated on a bench just outside the same store, discreetly filling out an evaluation form on a tablet moments after leaving, focused and quick posture.',
      },
      {
        id: 'item-01-mapa-experiencia',
        outFile: 'entregable-01-mapa-experiencia',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same person as the reference image, now in an office reviewing a printed customer journey map covered with colored sticky notes pinned on the wall, tracing the path with a finger.',
      },
      {
        id: 'item-02-scorecard-locales',
        outFile: 'entregable-02-scorecard-locales',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same person as the reference image, now at a desk reviewing a laptop dashboard with color-coded scorecards ranking multiple store locations, comparing rows of scores.',
      },
      {
        id: 'item-03-benchmark-competencia',
        outFile: 'entregable-03-benchmark-competencia',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same person as the reference image, now comparing two printed evaluation sheets side by side on a desk, one labeled with their own store results and one with a competitor store, cross-checking scores.',
      },
      {
        id: 'item-04-brief-activacion',
        outFile: 'entregable-04-brief-activacion',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same person as the reference image, now handing a one-page action brief document to a store manager inside a small retail back office, both looking at the paper together.',
      },
      {
        id: 'item-05-executive-brief',
        outFile: 'entregable-05-executive-brief',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same person as the reference image, now standing in a boardroom presenting a concise two-page executive brief on a screen to blurred seated directors, confident presenting stance.',
      },
      {
        id: 'item-06-seguimiento',
        outFile: 'entregable-06-seguimiento',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same person as the reference image, back inside the same store weeks later, checklist in hand, checking off visible improvements on the shop floor, satisfied verifying posture.',
      },
    ],
  },
  {
    id: 'investigacion-cuantitativa',
    outputDir: path.join(root, 'public', 'imagenes-mindtec', 'generated', 'investigacion-cuantitativa', 'entregables'),
    images: [
      {
        id: 'cover',
        outFile: 'entregables-cover',
        chainStart: true,
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'A field survey interviewer with a tablet conducting a structured survey with a respondent on a busy urban street in Bolivia, both engaged in conversation, natural daylight.',
      },
      {
        id: 'intro',
        outFile: 'entregables-intro',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same interviewer as the reference image, now seated at a desk reviewing collected survey data on a laptop with statistical charts on screen, same tablet resting beside the laptop.',
      },
      {
        id: 'item-01-reporte-ejecutivo',
        outFile: 'entregable-01-reporte-ejecutivo',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same person as the reference image, now writing an executive report on a laptop with a clean bar chart of key findings visible on screen, focused writing posture in an office.',
      },
      {
        id: 'item-02-segmentacion',
        outFile: 'entregable-02-segmentacion',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same person as the reference image, now standing in front of a whiteboard with a cluster map of consumer segments, circles with labels and small demographic icons, marker in hand explaining the map.',
      },
      {
        id: 'item-03-awareness-preferencia',
        outFile: 'entregable-03-awareness-preferencia',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same person as the reference image, now reviewing a brand funnel chart with declining bars (awareness, preference, purchase) on a large monitor, pointing at the middle stage.',
      },
      {
        id: 'item-04-demanda-dimensionamiento',
        outFile: 'entregable-04-demanda-dimensionamiento',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same person as the reference image, now in a meeting room reviewing market sizing pie charts and demand estimates projected on a large screen, seated with a notebook.',
      },
      {
        id: 'item-05-dashboard-datos',
        outFile: 'entregable-05-dashboard-datos',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same person as the reference image, now working at a desk with a large monitor full of data tables and cross-tabulation grids, hands on keyboard, deep focus.',
      },
      {
        id: 'item-06-presentacion-directorio',
        outFile: 'entregable-06-presentacion-directorio',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same person as the reference image, now presenting statistical findings on a screen to a boardroom of blurred executives, gesturing toward a chart, confident stance.',
      },
    ],
  },
  {
    id: 'shopper-insights',
    outputDir: path.join(root, 'public', 'imagenes-mindtec', 'generated', 'shopper-insights', 'entregables'),
    images: [
      {
        id: 'cover',
        outFile: 'entregables-cover',
        chainStart: true,
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'A shopper researcher discreetly observing a customer navigating a supermarket aisle in Bolivia with generic unbranded products on the shelves (no visible brand names, logos or recognizable packaging), notebook in hand, standing a respectful distance away, natural in-store lighting.',
      },
      {
        id: 'intro',
        outFile: 'entregables-intro',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same researcher as the reference image, now reviewing an eye-tracking heatmap of the same aisle on a tablet, standing near the shelf of generic unbranded products (no visible brand names or logos), comparing the data to the real shelf in front.',
      },
      {
        id: 'item-01-journey-shopper',
        outFile: 'entregable-01-journey-shopper',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same person as the reference image, now in an office pinning a printed shopper journey map with arrows and photos of store zones onto a wall board, arranging the sequence.',
      },
      {
        id: 'item-02-trayectoria-permanencia',
        outFile: 'entregable-02-trayectoria-permanencia',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same person as the reference image, now reviewing a store floor-plan heatmap on a tablet showing dwell-time zones in warm and cool colors, seated at a desk.',
      },
      {
        id: 'item-03-atencion-visual',
        outFile: 'entregable-03-atencion-visual',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'A shopper wearing lightweight eye-tracking glasses looking at a supermarket shelf stocked with generic unbranded products (no visible brand names or logos), with the same researcher standing nearby holding a tablet displaying live gaze-tracking data.',
      },
      {
        id: 'item-04-decisores-compra',
        outFile: 'entregable-04-decisores-compra',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same researcher as the reference image, now at a table arranging printed cards ranking purchase-decision factors (price, packaging, position) in order of importance, mid-arrangement.',
      },
      {
        id: 'item-05-brief-trade-marketing',
        outFile: 'entregable-05-brief-trade-marketing',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same researcher as the reference image, now redesigning a small shelf mockup model made of plain unbranded grey boxes on a table, sticky notes marking new layout positions, hands adjusting a miniature shelf.',
      },
      {
        id: 'item-06-executive-brief-comercial',
        outFile: 'entregable-06-executive-brief-comercial',
        prompt:
          STYLE_PREFIX +
          RIGHT_CARD_COMPOSITION +
          'Same researcher as the reference image, now presenting a trade marketing brief with conversion-rate charts to a small commercial team meeting, gesturing at the screen, engaged listeners blurred.',
      },
    ],
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
  for (let attempt = 0; attempt < 220; attempt += 1) {
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

async function downloadAndSave(url, outputDir, outFile) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo descargar la imagen: HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  await fs.mkdir(outputDir, { recursive: true });
  const outPath = path.join(outputDir, `${outFile}.webp`);
  await sharp(buffer).webp({ quality: 82 }).toFile(outPath);

  return outPath;
}

async function runSection(section) {
  const items = onlyFilter ? section.images.filter((img) => onlyFilter.includes(img.id)) : section.images;

  if (items.length === 0) {
    console.log(`[${section.id}] Ningún id coincide con --only=${onlyFilter?.join(',')}, se omite.`);
    return [];
  }

  console.log(`\n=== ${section.id} — generando ${items.length} imagen(es) ===\n`);

  const results = [];
  let lastReferenceUrl = null;

  for (let i = 0; i < items.length; i += 1) {
    const img = items[i];
    const label = `[${section.id}] [${i + 1}/${items.length}] ${img.id}`;

    const referenceForThisCall = img.chainStart ? null : lastReferenceUrl;

    try {
      console.log(`${label} creando tarea...`);
      const taskId = await createTask(img.prompt, referenceForThisCall);

      console.log(`${label} taskId=${taskId} esperando resultado...`);
      const resultUrl = await pollTask(taskId);

      console.log(`${label} descargando y guardando...`);
      const outPath = await downloadAndSave(resultUrl, section.outputDir, img.outFile);

      lastReferenceUrl = resultUrl;
      results.push({ section: section.id, id: img.id, status: 'OK', outPath });
      console.log(`${label} OK -> ${outPath}\n`);
    } catch (err) {
      results.push({ section: section.id, id: img.id, status: 'FAILED', error: err.message });
      console.error(`${label} FALLÓ: ${err.message}\n`);
    }
  }

  return results;
}

async function main() {
  const sections = sectionFilter ? SECTIONS.filter((s) => sectionFilter.includes(s.id)) : SECTIONS;

  if (sections.length === 0) {
    console.error(`Ninguna sección coincide con --section=${sectionFilter?.join(',')}`);
    process.exit(1);
  }

  const allResults = [];
  for (const section of sections) {
    const results = await runSection(section);
    allResults.push(...results);
  }

  console.log('\n--- Resumen ---');
  for (const r of allResults) {
    console.log(`${r.status === 'OK' ? '✔' : '✘'} [${r.section}] ${r.id}${r.status === 'FAILED' ? ` — ${r.error}` : ''}`);
  }

  const failed = allResults.filter((r) => r.status === 'FAILED');
  if (failed.length > 0) {
    console.log(`\n${failed.length} fallaron.`);
    process.exitCode = 1;
  }
}

main();
