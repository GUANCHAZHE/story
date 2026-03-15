import { json, resolveOpenAIAccessToken } from './_openai';

export default async function handler(req: any, res: any) {
  const token = resolveOpenAIAccessToken(req);
  if (!token) {
    json(res, 200, { authenticated: false });
    return;
  }

  json(res, 200, { authenticated: true });
}
