
export default async function handler(req, res) {
  const ua = req.headers['user-agent'] || 'unknown';
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const time = new Date().toISOString();

  // 判断 UA 是否属于可疑来源
  const suspiciousKeywords = [
    'tiktok', 'musical_ly', 'bytedancewebview', 'douyin', 'trill',
    'ttnet', 'com.ss.android', 'ss.android.ugc.trill', 'cronet', 'liteapp', 'tiktoklite'
  ];
  const uaLower = ua.toLowerCase();
  const isSuspicious = suspiciousKeywords.some(k => uaLower.includes(k));
  const type = isSuspicious ? 'suspicious' : 'all';

  // 输出日志（控制台可见）
  console.log(`🕵️ UA Log\nTime: ${time}\nIP: ${ip}\nType: ${type}\nUA: ${ua}\n---`);

  // 发送到 Google Sheets 
  const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbxZlHcLl9t52DBXSyDwxaK6QHsVMDzNRAIMxRYVyluSRK__YsfCz20xdwx6YqRWYgiV/exec';

  try {
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ua, ip, time, type }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('❌ Failed to log:', text);
      return res.status(500).json({ error: 'Log failed' });
    }

    res.status(200).json({ status: 'logged' });
  } catch (error) {
    console.error('❌ Error logging:', error);
    res.status(500).json({ error: 'Log failed' });
  }
}
