export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host) {
    try {
      const originUrl = new URL(origin);
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

  if (input.website) {
    return res.status(400).json({ error: 'Não foi possível enviar. Tente novamente.' });
  }

  const { id, company, name, phone, email } = input;
  if (
    typeof id !== 'string' ||
    !/^[a-f0-9-]{36}$/i.test(id) ||
    [company, name, phone, email].some((v) => typeof v !== 'string') ||
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

  return res.status(201).json({ ok: true });
}
