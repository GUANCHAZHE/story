import crypto from 'crypto';

export default async function handler(req: any, res: any) {
  const clientId = process.env.OPENAI_OAUTH_CLIENT_ID;
  const appUrl = process.env.APP_URL || `https://${req.headers.host}`;
  const redirectUri = process.env.OPENAI_OAUTH_REDIRECT_URI || `${appUrl}/api/oauth-callback`;
  const authBase = process.env.OPENAI_OAUTH_AUTH_URL || 'https://auth.openai.com/oauth/authorize';

  if (!clientId) {
    res.statusCode = 500;
    res.end('Missing OPENAI_OAUTH_CLIENT_ID');
    return;
  }

  const state = crypto.randomBytes(16).toString('hex');
  res.setHeader('Set-Cookie', `openai_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);

  const url = new URL(authBase);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', process.env.OPENAI_OAUTH_SCOPE || 'openid profile email');
  url.searchParams.set('state', state);

  res.statusCode = 302;
  res.setHeader('Location', url.toString());
  res.end();
}
