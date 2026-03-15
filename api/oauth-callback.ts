import { getCookie, getCookieSecurity, makeCookie } from './_openai';

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

  try {
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

    const text = await response.text();
    let payload: any = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = { raw: text };
    }

  const cookieSecurity = getCookieSecurity(req);
  res.setHeader('Set-Cookie', [
    makeCookie('openai_oauth_state', '', { ...cookieSecurity, maxAge: 0 }),
    makeCookie('openai_access_token', payload.access_token, { ...cookieSecurity, maxAge: Math.min(payload.expires_in || 3600, 604800) }),
  ]);

    const cookieSecurity = getCookieSecurity(req);
    res.setHeader('Set-Cookie', [
      makeCookie('openai_oauth_state', '', { ...cookieSecurity, maxAge: 0 }),
      makeCookie('openai_access_token', payload.access_token, { ...cookieSecurity, maxAge: Math.min(payload.expires_in || 3600, 604800) }),
    ]);

    res.statusCode = 302;
    res.setHeader('Location', '/');
    res.end();
  } catch (error: any) {
    res.statusCode = 502;
    res.end(`OAuth token exchange request failed: ${error?.message || 'Network error'}。如在中国大陆访问，请确认服务器可连接 OpenAI OAuth 域名。`);
  }
}
