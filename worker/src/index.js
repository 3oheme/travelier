const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    const segments = new URL(request.url).pathname.split('/').filter(Boolean);

    if (segments[0] !== 'plays') {
      return new Response('Not found', { status: 404, headers: CORS });
    }

    const placeId = segments[1];

    // GET /plays — all counts at once (used by catalog page)
    if (!placeId && request.method === 'GET') {
      const { keys } = await env.PLAYS.list({ prefix: 'plays:' });
      const entries = await Promise.all(
        keys.map(async ({ name }) => {
          const id = name.slice('plays:'.length);
          const val = parseInt(await env.PLAYS.get(name) || '0');
          return [id, val];
        })
      );
      return json(Object.fromEntries(entries));
    }

    // GET /plays/:id — count for one place (used by detail page on load)
    if (placeId && request.method === 'GET') {
      const val = parseInt(await env.PLAYS.get(`plays:${placeId}`) || '0');
      return json({ plays: val });
    }

    // POST /plays/:id — increment on play
    if (placeId && request.method === 'POST') {
      const key = `plays:${placeId}`;
      const current = parseInt(await env.PLAYS.get(key) || '0');
      const next = current + 1;
      await env.PLAYS.put(key, String(next));
      return json({ plays: next });
    }

    return new Response('Method not allowed', { status: 405, headers: CORS });
  },
};
