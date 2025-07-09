export default async function handler(req, res) {
  const ua = req.headers['user-agent'] || 'unknown';
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const time = new Date().toISOString();

  console.log(`🕵️ UA Log at ${time}\nIP: ${ip}\nUA: ${ua}\n---`);

  // 调用 Google Apps Script 写日志接口 URL，改成你的实际地址
  const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbxZlHcLl9t52DBXSyDwxaK6QHsVMDzNRAIMxRYVyluSRK__YsfCz20xdwx6YqRWYgiV/exec';

  try {
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ua,
        ip,
        time,
        type: 'all'  // 你可以根据需求调整
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Failed to write log to Sheets:', text);
      return res.status(500).json({ error: 'Failed to write log' });
    }

    res.status(200).json({ status: 'logged' });
  } catch (error) {
    console.error('Error writing log:', error);
    res.status(500).json({ error: 'Error writing log' });
  }
}
