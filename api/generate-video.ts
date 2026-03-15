import { callOpenAI, json, resolveOpenAIAccessToken } from './_openai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const token = resolveOpenAIAccessToken(req);
  if (!token) {
    json(res, 401, { error: 'Not authenticated with OpenAI OAuth' });
    return;
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const { prompt } = body;
  if (!prompt) {
    json(res, 400, { error: 'Missing prompt' });
    return;
  }

  try {
    const payload = await callOpenAI('/v1/videos/generations', token, {
      model: process.env.OPENAI_VIDEO_MODEL || 'sora-1',
      prompt: `${prompt} cinematic anime fantasy style, frieren inspired tone`,
      duration: Number(process.env.OPENAI_VIDEO_DURATION_SECONDS || 5),
      resolution: process.env.OPENAI_VIDEO_RESOLUTION || '720p',
    });

    json(res, 200, {
      id: payload.id,
      status: payload.status,
      videoUrl: payload.output?.[0]?.url || null,
      raw: payload,
    });
  } catch (error: any) {
    json(res, 500, { error: error.message || 'OpenAI video generation failed' });
  }
}
