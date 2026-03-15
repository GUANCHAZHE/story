import type { IncomingMessage } from 'http';

export function getCookie(req: IncomingMessage, name: string): string | null {
  const raw = req.headers.cookie;
  if (!raw) return null;
  const cookies = raw.split(';').map((part) => part.trim());
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.split('=');
    if (key === name) {
      return decodeURIComponent(rest.join('='));
    }
  }
  return null;
}

export function resolveOpenAIAccessToken(req: IncomingMessage): string | null {
  return getCookie(req, 'openai_access_token') || process.env.OPENAI_API_KEY || null;
}

export function json(res: any, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

export async function callOpenAI(path: string, token: string, body: unknown) {
  const response = await fetch(`https://api.openai.com${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let payload: any = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text };
  }

  if (!response.ok) {
    const msg = payload?.error?.message || `OpenAI request failed: ${response.status}`;
    throw new Error(msg);
  }

  return payload;
}
