import { getCookie } from './_openai';

export default async function handler(req: any, res: any) {
  const code = req.query?.code;
  const state = req.query?.state;
  const expectedState = getCookie(req, 'openai_oauth_state');

  const clientId = process.env.OPENAI_OAUTH_CLIENT_ID;
  const clientSecret = process.env.OPENAI_OAUTH_CLIENT_SECRET;
  const appUrl = process.env.APP_URL || `https://${req.headers.host}`;
  const redirectUri = process.env.OPENAI_OAUTH_REDIRECT_URI || `${appUrl}/api/oauth-callback`;
  const tokenUrl = process.env.OPENAI_OAUTH_TOKEN_URL || 'https://auth.openai.com/oauth/token';

  if (!code || !state || !expectedState || state !== expectedState) {
    res.statusCode = 400;
    res.end('OAuth state mismatch');
    return;
  }

  if (!clientId || !clientSecret) {
    res.statusCode = 500;
    res.end('Missing OPENAI OAuth credentials');
    return;
  }

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  const payload: any = await response.json();

  if (!response.ok || !payload.access_token) {
    res.statusCode = 502;
    res.end(payload.error_description || payload.error || 'OAuth token exchange failed');
    return;
  }

  res.setHeader('Set-Cookie', [
    'openai_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    `openai_access_token=${encodeURIComponent(payload.access_token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.min(payload.expires_in || 3600, 604800)}`,
  ]);

  res.statusCode = 302;
  res.setHeader('Location', '/');
  res.end();
}
