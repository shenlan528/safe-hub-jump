const crypto = require('crypto');

const SHARED_KEY = 'LoveTheTk@@EveryDay';

export default function handler(req, res) {
  const { id, ts, sign } = req.query;

  const now = Math.floor(Date.now() / 1000);
  if (!id || !ts || !sign) return res.status(400).json({ error: 'Missing params' });
  if (Math.abs(now - parseInt(ts)) > 300) return res.status(403).json({ error: 'Expired' });

  const expectedSign = crypto.createHash('sha256').update(ts + SHARED_KEY).digest('hex');
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
