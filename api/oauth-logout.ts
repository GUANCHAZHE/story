export default async function handler(req: any, res: any) {
  res.setHeader('Set-Cookie', 'openai_access_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  res.statusCode = 302;
  res.setHeader('Location', '/');
  res.end();
}
