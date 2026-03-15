import { getCookie, json, resolveOpenAIAccessToken } from './_openai';

export default async function handler(req: any, res: any) {
  const cookieToken = getCookie(req, 'openai_access_token');
  const hasServerKey = Boolean(process.env.OPENAI_API_KEY);
  const token = resolveOpenAIAccessToken(req);

  if (!token) {
    json(res, 200, { authenticated: false, mode: null });
    return;
  }

  const mode = cookieToken ? 'oauth' : hasServerKey ? 'server_key' : 'unknown';
  json(res, 200, { authenticated: true, mode });
}
