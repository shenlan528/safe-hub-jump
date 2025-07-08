export default function handler(req, res) {
  const ua = (req.headers['user-agent'] || '').toLowerCase();

  const safeUAKeywords = [
    'safari', 'chrome', 'crios', 'firefox', 'fxios',
    'edg', 'opera', 'samsungbrowser'
  ];

  const suspiciousKeywords = [
    'tiktok', 'douyin', 'musical_ly', 'bytedancewebview',
    'ttnet', 'trill', '_ly', 'webview', 'ttwebview',
    'sslocal', 'bytedance', 'liteapp', 'appwebview'
  ];

  const isSafe = safeUAKeywords.some(k => ua.includes(k));
  const isSuspicious = suspiciousKeywords.some(k => ua.includes(k));
  const isHeadless = !!req.headers['sec-ch-ua-platform']?.includes('Headless');
  const result = isSafe && !isSuspicious && !isHeadless;

  res.status(200).json({
    result, ua
  });
}
