export default async function handler(req, res) {
  const { ts } = req.query;
  const key = 'LoveTheTk@@EveryDay';

  const sign = await sha256(ts + key);
  return res.status(200).json({ sign });
}

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
