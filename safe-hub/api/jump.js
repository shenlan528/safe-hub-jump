export default async function handler(req, res) {
  const { id, ts, sign } = req.query;
  const key = 'LoveTheTk@@EveryDay';
  const now = Math.floor(Date.now() / 1000);

  if (!id || !ts || !sign) return res.status(400).send("Missing params");
  if (Math.abs(now - parseInt(ts)) > 300) return res.status(403).send("Expired");

  const expectedSign = await sha256(ts + key);
  if (sign !== expectedSign) return res.status(403).send("Invalid signature");

  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const suspiciousKeywords = [
    'tiktok', 'douyin', 'musical_ly', 'bytedancewebview', 'ttnet', 'trill', '_ly',
    'webview', 'ttwebview', 'sslocal', 'bytedance', 'liteapp', 'appwebview',
    'tiktoklite', 'ss.android.ugc.trill', 'com.ss.android', 'cronet'
  ];
  if (ua.includes('tik')) return res.status(403).send("Suspicious new keyword detected");
  const isSuspicious = suspiciousKeywords.some(k => ua.includes(k));
  if (isSuspicious) return res.status(403).send("Blocked by server UA");

  const map = {
    a1: "https://live-hub-jump.shenlan528.workers.dev/a1",
    a2: "https://live-hub-jump.shenlan528.workers.dev/a2",
    a3: "https://live-hub-jump.shenlan528.workers.dev/a3"
  };
  const url = map[id];
  if (!url) return res.status(404).send("Invalid id");

  res.writeHead(302, { Location: url });
  res.end();
}

async function sha256(input) {
  const buffer = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}
