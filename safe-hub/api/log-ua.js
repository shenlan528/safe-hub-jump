export default async function handler(req, res) {
  const ua = req.headers['user-agent'] || 'unknown';
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const time = new Date().toISOString();

  const suspiciousKeywords = [
    'tiktok', 'musical_ly', 'bytedancewebview', 'douyin', 'trill',
    'ttnet', 'com.ss.android', 'ss.android.ugc.trill', 'cronet', 'liteapp', 'tiktoklite'
  ];
  const uaLower = ua.toLowerCase();
  const isSuspicious = suspiciousKeywords.some(k => uaLower.includes(k));
  const type = isSuspicious ? 'suspicious' : 'all';

  const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbxZlHcLl9t52DBXSyDwxaK6QHsVMDzNRAIMxRYVyluSRK__YsfCz20xdwx6YqRWYgiV/exec';

  try {
    await fetch(googleScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ua, ip, time, type })
    });
    res.status(200).json({ status: 'logged' });
  } catch (error) {
    console.error('❌ Log failed:', error);
    res.status(500).json({ error: 'Log failed' });
  }
}
