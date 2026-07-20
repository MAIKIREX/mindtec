export async function generateImage(prompt: string): Promise<string> {
  const createRes = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!createRes.ok) {
    throw new Error(`Error al iniciar generación: ${await createRes.text()}`);
  }

  const { taskId } = await createRes.json();

  // Polling hasta que la tarea termine
  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise((r) => setTimeout(r, 3000));

    const statusRes = await fetch(`/api/generate-image-status?taskId=${taskId}`);
    const statusData = await statusRes.json();

    const state = statusData.data?.status;

    if (state === 'SUCCESS') {
      return statusData.data.response?.resultUrls?.[0];
    }
    if (state === 'FAILED') {
      throw new Error(`Generación fallida: ${statusData.data?.failMsg}`);
    }
  }

  throw new Error('Tiempo de espera agotado');
}
