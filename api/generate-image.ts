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
    const payload = await callOpenAI('/v1/images/generations', token, {
      model: process.env.OPENAI_IMAGE_MODEL || 'sora-1',
      prompt: `${prompt} anime fantasy style, frieren style, high quality, masterpiece, serene, slightly melancholic`,
      size: '1536x1024',
    });

    const b64 = payload.data?.[0]?.b64_json;
    const url = payload.data?.[0]?.url;

    if (b64) {
      json(res, 200, { image: `data:image/png;base64,${b64}` });
      return;
    }

    if (url) {
      json(res, 200, { image: url });
      return;
    }

    json(res, 502, { error: 'No image returned from OpenAI' });
  } catch (error: any) {
    json(res, 500, { error: error.message || 'OpenAI image generation failed' });
  }
}
