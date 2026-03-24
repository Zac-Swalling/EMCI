import type { VercelRequest, VercelResponse } from '@vercel/node';

const DATAVERSE_BASE = 'https://mcicrm.crm6.dynamics.com';

/**
 * /api/dataverse/:path*
 * Proxies requests to the Dynamics 365 / Dataverse CRM, forwarding the
 * Authorization header supplied by the client so that the CRM enforces the
 * caller's identity.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, OData-MaxVersion, OData-Version, Prefer');

  if (req.method === 'OPTIONS') return res.status(204).end();

  // Build the upstream path from the dynamic segment + query string
  const pathSegments = Array.isArray(req.query.path) ? req.query.path : [req.query.path ?? ''];
  const upstreamPath = pathSegments.join('/');
  const rawQuery = req.url?.split('?')[1] ?? '';
  const targetUrl = `${DATAVERSE_BASE}/${upstreamPath}${rawQuery ? `?${rawQuery}` : ''}`;

  const headers: Record<string, string> = {
    'Content-Type':    'application/json',
    'OData-MaxVersion': '4.0',
    'OData-Version':   '4.0',
  };

  const auth = req.headers.authorization;
  if (auth) headers['Authorization'] = auth;

  const prefer = req.headers.prefer as string | undefined;
  if (prefer) headers['Prefer'] = prefer;

  try {
    const upstream = await fetch(targetUrl, {
      method:  req.method ?? 'GET',
      headers,
      body:    req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const text = await upstream.text();
    res.setHeader('Content-Type', 'application/json');
    return res.status(upstream.status).send(text);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Proxy error';
    return res.status(502).json({ error: msg });
  }
}
