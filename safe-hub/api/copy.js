// /api/copy.js

export default async function handler(req, res) {
  const { id, ts, sign } = req.query;
  const key = 'LoveTheTk@@EveryDay';
  const now = Math.floor(Date.now() / 1000);

  const expectedSign = await sha256(ts + key);
  if (sign !== expectedSign || Math.abs(now - ts) > 60) {
    return res.status(403).json({ error: 'Invalid or expired signature' });
  }

  const urlMap = {
    a1: 'https://live-hub-jump.shenlan528.workers.dev/a1',
    a2: 'https://live-hub-jump.shenlan528.workers.dev/a2',
    a3: 'https://live-hub-jump.shenlan528.workers.dev/a3'
  };

  const target = urlMap[id];
  if (!target) {
    return res.status(400).json({ error: 'Invalid room ID' });
  }

  // 获取用户信息
  const ua = req.headers['user-agent'] || 'unknown';
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const time = new Date().toISOString();

  // ✅ 上报 Google Sheets
  const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbxZlHcLl9t52DBXSyDwxaK6QHsVMDzNRAIMxRYVyluSRK__YsfCz20xdwx6YqRWYgiV/exec';
  try {
    await fetch(googleScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ua, ip, time, type: 'copy'  // type = copy 用于和 log-ua 区分
      }),
    });
  } catch (e) {
    console.error('❌ Failed to log /api/copy call:', e.message);
    // 不影响主流程返回
  }

  return res.status(200).json({ t: Buffer.from(target).toString('base64') });
}

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
