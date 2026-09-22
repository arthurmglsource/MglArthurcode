import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

// Body parsing with 4KB limit as per original worker
app.use(express.json({ limit: '4kb' }));

// In-memory leads storage (mirroring D1/SQLite leads table)
// Schema: id (text PK), company (text), name (text), phone (text), email (text), created_at (integer)
const leads = [];

const reply = (res, body, status = 200) => {
  res.set('Cache-Control', 'no-store');
  return res.status(status).json(body);
};

// POST /api/leads endpoint
app.post('/api/leads', (req, res) => {
  // Origin check (if provided, verify against host or trusted origins)
  const origin = req.headers.origin;
  const host = req.get('host');
  if (origin && host) {
    try {
      const originUrl = new URL(origin);
      if (
        originUrl.host !== host &&
        !originUrl.hostname.endsWith('.run.app') &&
        !originUrl.hostname.includes('localhost') &&
        !originUrl.hostname.includes('127.0.0.1')
      ) {
        return reply(res, { error: 'Origem inválida.' }, 403);
      }
    } catch {
      return reply(res, { error: 'Origem inválida.' }, 403);
    }
  }

  const input = req.body;
  if (!input || typeof input !== 'object') {
    return reply(res, { error: 'Pedido inválido.' }, 400);
  }

  // Honeypot check
  if (input.website) {
    return reply(res, { error: 'Não foi possível enviar. Tente novamente.' }, 400);
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
    return reply(res, { error: 'Verifique os campos e tente novamente.' }, 400);
  }

  // Idempotency check: duplicate submissions with the same UUID return success
  const existing = leads.find((l) => l.id === id);
  if (existing) {
    return reply(res, { ok: true }, 200);
  }

  // Rate limiting: maximum 3 requests per email in the last hour
  const oneHourAgo = Date.now() - 3600000;
  const normalizedEmail = email.trim().toLowerCase();
  const recentCount = leads.filter(
    (l) => l.email === normalizedEmail && l.created_at > oneHourAgo
  ).length;

  if (recentCount >= 3) {
    return reply(res, { error: 'Já recebemos os seus pedidos. Tente novamente mais tarde.' }, 429);
  }

  // Store the lead
  leads.push({
    id,
    company: company.trim(),
    name: name.trim(),
    phone: phone.trim(),
    email: normalizedEmail,
    created_at: Date.now(),
  });

  return reply(res, { ok: true }, 201);
});

// All other methods on /api/leads are not allowed
app.all('/api/leads', (req, res) => {
  return reply(res, { error: 'Método não permitido.' }, 405);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Static assets serving from dist directory
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to index.html for client routing
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Bind to port and host
app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
