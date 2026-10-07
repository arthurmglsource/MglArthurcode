export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  // Trusted origins
  const originHeader = req.headers.origin || 'https://www.mglgrowth.eu';
  const host = req.headers.host;
  if (req.headers.origin && host) {
    try {
      const originUrl = new URL(req.headers.origin);
      if (
        originUrl.host !== host &&
        !originUrl.hostname.endsWith('.vercel.app') &&
        !originUrl.hostname.endsWith('.mglgrowth.eu') &&
        !originUrl.hostname.includes('localhost') &&
        !originUrl.hostname.includes('127.0.0.1')
      ) {
        return res.status(403).json({ error: 'Origem inválida.' });
      }
    } catch {
      return res.status(403).json({ error: 'Origem inválida.' });
    }
  }

  let input = req.body;
  if (typeof input === 'string') {
    try {
      input = JSON.parse(input);
    } catch {
      return res.status(400).json({ error: 'Pedido inválido.' });
    }
  }

  if (!input || typeof input !== 'object') {
    return res.status(400).json({ error: 'Pedido inválido.' });
  }

  // Honeypot trap: if filled, quietly succeed without forwarding to CRM
  if (input.website) {
    return res.status(200).json({ ok: true });
  }

  const { id, company, name, phone, email } = input;
  if (
    !company ||
    !name ||
    !phone ||
    !email ||
    typeof company !== 'string' ||
    typeof name !== 'string' ||
    typeof phone !== 'string' ||
    typeof email !== 'string' ||
    company.trim().length < 2 ||
    company.length > 120 ||
    name.trim().length < 2 ||
    name.length > 120 ||
    phone.length > 35 ||
    phone.replace(/\D/g, '').length < 7 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return res.status(400).json({ error: 'Verifique os campos e tente novamente.' });
  }

  const mglOsEndpoint =
    process.env.MGL_OS_API_URL || 'https://mgl-os.vercel.app/api/leads';

  const clientIp =
    (typeof req.headers['x-forwarded-for'] === 'string'
      ? req.headers['x-forwarded-for'].split(',')[0].trim()
      : '') ||
    req.headers['x-real-ip'] ||
    req.socket.remoteAddress ||
    '127.0.0.1';

  try {
    const upstreamRes = await fetch(mglOsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': originHeader,
        'X-Forwarded-For': clientIp,
      },
      body: JSON.stringify({
        id: id || crypto.randomUUID(),
        name: name.trim(),
        company: company.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
      }),
      signal: AbortSignal.timeout(12000),
    });

    const upstreamData = await upstreamRes.json().catch(() => ({}));

    if (!upstreamRes.ok || upstreamData.ok !== true) {
      const errMessage =
        upstreamData.error ||
        (upstreamRes.status === 429
          ? 'Aguarde um minuto antes de tentar novamente.'
          : 'Não foi possível confirmar o envio. Tente novamente.');
      return res.status(upstreamRes.status || 500).json({ error: errMessage });
    }

    return res.status(201).json({ ok: true, success: true });
  } catch (err) {
    return res.status(502).json({
      error: 'Não foi possível ligar ao CRM MGL OS. Tente novamente.',
    });
  }
}
