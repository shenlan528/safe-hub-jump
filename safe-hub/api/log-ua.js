//export default function handler(req, res) {
  //const ua = req.headers['user-agent'] || 'unknown';
  //console.log('📱 UA:', ua);
  //res.status(200).json({ status: 'logged' });
//}
export default function handler(req, res) {
  const ua = req.headers['user-agent'] || 'unknown';
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const time = new Date().toISOString();

  console.log(`🕵️ UA Log at ${time}\nIP: ${ip}\nUA: ${ua}\n---`);

  res.status(200).json({ status: 'logged' });
}

