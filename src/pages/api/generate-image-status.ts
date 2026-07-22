import type { APIRoute } from 'astro';

export const prerender = false;

const MUAPI_BASE_URL = 'https://api.muapi.ai';

function extractImageUrl(data: any): string | null {
  return (
    data?.outputs?.[0] ??
    data?.output?.images?.[0] ??
    data?.output?.[0] ??
    data?.images?.[0] ??
    data?.url ??
    null
  );
}

export const GET: APIRoute = async ({ url, locals }) => {
  const apiKey =
    (locals as any).runtime?.env?.MUAPI_API_KEY ?? import.meta.env.MUAPI_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'MUAPI_API_KEY no configurada' }),
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
    `${MUAPI_BASE_URL}/api/v1/predictions/${taskId}/result`,
    { headers: { 'x-api-key': apiKey } }
  );

  const statusData = await statusRes.json();
  const status = statusData?.status;

  // Normaliza la respuesta al formato { data: { status, response: { resultUrls } } }
  // que ya consume el frontend (src/lib/kieClient.ts).
  const normalized = {
    data: {
      status: status === 'completed' ? 'SUCCESS' : status === 'failed' || status === 'cancelled' ? 'FAILED' : status,
      failMsg: statusData?.error,
      response: { resultUrls: [extractImageUrl(statusData)].filter(Boolean) },
    },
  };

  return new Response(JSON.stringify(normalized), {
    status: statusRes.status,
    headers: { 'Content-Type': 'application/json' },
  });
};
