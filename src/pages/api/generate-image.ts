import type { APIRoute } from 'astro';

export const prerender = false;

const KIE_BASE_URL = 'https://api.kie.ai';

export const POST: APIRoute = async ({ request, locals }) => {
  // En Cloudflare Pages, las variables de entorno en producción se leen
  // desde locals.runtime.env (bindings), no desde process.env/import.meta.env.
  const apiKey =
    (locals as any).runtime?.env?.KIE_API_KEY ?? import.meta.env.KIE_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'KIE_API_KEY no configurada' }),
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
  const createRes = await fetch(`${KIE_BASE_URL}/api/v1/gpt4o-image/generate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      size: '1:1',
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
  const taskId = createData.data?.taskId;

  if (!taskId) {
    return new Response(
      JSON.stringify({ error: 'Respuesta inesperada de Kie.ai', detail: createData }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(JSON.stringify({ taskId }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
