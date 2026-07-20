import type { APIRoute } from 'astro';

export const prerender = false;

const KIE_BASE_URL = 'https://api.kie.ai';

export const GET: APIRoute = async ({ url, locals }) => {
  const apiKey =
    (locals as any).runtime?.env?.KIE_API_KEY ?? import.meta.env.KIE_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'KIE_API_KEY no configurada' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const taskId = url.searchParams.get('taskId');

  if (!taskId) {
    return new Response(JSON.stringify({ error: 'Falta taskId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const statusRes = await fetch(
    `${KIE_BASE_URL}/api/v1/gpt4o-image/record-info?taskId=${taskId}`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );

  const statusData = await statusRes.json();

  return new Response(JSON.stringify(statusData), {
    status: statusRes.status,
    headers: { 'Content-Type': 'application/json' },
  });
};
