export default async function handler(req, res) {
  const { id, ts, sign } = req.query;

  const key = 'LoveTheTk@@EveryDay';
  const now = Math.floor(Date.now() / 1000);

  if (!id || !ts || !sign) return res.status(400).json({ error: 'Missing params' });
  if (Math.abs(now - parseInt(ts)) > 300) return res.status(403).json({ error: 'Expired' });

  const expectedSign = await sha256(ts + key);
  if (sign !== expectedSign) return res.status(403).json({ error: 'Invalid signature' });

  const map = {
    a1: "https://live-hub-jump.shenlan528.workers.dev/a1",
    a2: "https://live-hub-jump.shenlan528.workers.dev/a2",
    a3: "https://live-hub-jump.shenlan528.workers.dev/a3"
  };

  const url = map[id];
  if (!url) return res.status(404).json({ error: 'Invalid id' });

  const encoded = Buffer.from(url).toString('base64');
  res.status(200).json({ t: encoded });
}

// ✅ 兼容 Vercel 的 Web Crypto API 签名函数
async function sha256(input) {
  const buffer = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}
