import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const MUAPI_BASE_URL = 'https://api.muapi.ai';
const MODEL = 'flux-dev-image';

export function getApiKey() {
  const apiKey = process.env.MUAPI_API_KEY;
  if (!apiKey) {
    console.error('Falta MUAPI_API_KEY en el entorno. Ejecuta con: node --env-file=.env scripts/<script>.mjs');
    process.exit(1);
  }
  return apiKey;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createTask(prompt, referenceUrl, size = '1216*832') {
  const apiKey = getApiKey();
  const body = { prompt, size, num_images: 1 };
  if (referenceUrl) body.image = referenceUrl;

  const res = await fetch(`${MUAPI_BASE_URL}/api/v1/${MODEL}`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  const requestId = data?.request_id;

  if (!res.ok || !requestId) {
    throw new Error(`No se pudo crear la tarea: ${JSON.stringify(data)}`);
  }

  return requestId;
}

function extractImageUrl(data) {
  return (
    data?.outputs?.[0] ??
    data?.output?.images?.[0] ??
    data?.output?.[0] ??
    data?.images?.[0] ??
    data?.url ??
    null
  );
}

export async function pollTask(requestId) {
  const apiKey = getApiKey();
  for (let attempt = 0; attempt < 120; attempt += 1) {
    await sleep(5000);

    const res = await fetch(`${MUAPI_BASE_URL}/api/v1/predictions/${requestId}/result`, {
      headers: { 'x-api-key': apiKey },
    });
    const data = await res.json();
    const status = data?.status;

    if (status === 'completed') {
      const url = extractImageUrl(data);
      if (!url) throw new Error(`Tarea completada pero sin URL de imagen: ${JSON.stringify(data)}`);
      return url;
    }

    if (status === 'failed' || status === 'cancelled') {
      throw new Error(`Generación fallida: ${data?.error ?? JSON.stringify(data)}`);
    }
  }

  throw new Error('Tiempo de espera agotado esperando la tarea');
}

export async function downloadAndSave(url, outputDir, outFile) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo descargar la imagen: HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  await fs.mkdir(outputDir, { recursive: true });
  const outPath = path.join(outputDir, `${outFile}.webp`);
  await sharp(buffer).webp({ quality: 82 }).toFile(outPath);

  return outPath;
}
