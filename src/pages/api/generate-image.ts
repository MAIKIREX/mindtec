import type { APIRoute } from 'astro';

export const prerender = false;

const MUAPI_BASE_URL = 'https://api.muapi.ai';
const MODEL = 'flux-dev-image';

export const POST: APIRoute = async ({ request, locals }) => {
  // En Cloudflare Pages, las variables de entorno en producción se leen
  // desde locals.runtime.env (bindings), no desde process.env/import.meta.env.
  const apiKey =
    (locals as any).runtime?.env?.MUAPI_API_KEY ?? import.meta.env.MUAPI_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'MUAPI_API_KEY no configurada' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { prompt } = await request.json();

  if (!prompt) {
    return new Response(JSON.stringify({ error: 'Falta el prompt' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 1. Crear la tarea de generación de imagen
  const createRes = await fetch(`${MUAPI_BASE_URL}/api/v1/${MODEL}`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      size: '1216*832',
      num_images: 1,
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    return new Response(
      JSON.stringify({ error: 'Error al crear la tarea', detail: errText }),
      { status: createRes.status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const createData = await createRes.json();
  const taskId = createData?.request_id;

  if (!taskId) {
    return new Response(
      JSON.stringify({ error: 'Respuesta inesperada de Muapi', detail: createData }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(JSON.stringify({ taskId }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
