import { getCookieSecurity, makeCookie } from './_openai';

export default async function handler(req: any, res: any) {
  const cookieSecurity = getCookieSecurity(req);
  res.setHeader('Set-Cookie', makeCookie('openai_access_token', '', { ...cookieSecurity, maxAge: 0 }));
  res.statusCode = 302;
  res.setHeader('Location', '/');
  res.end();
}
