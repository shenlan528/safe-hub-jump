export default function handler(req, res) {
  const ua = req.headers['user-agent'] || 'unknown';
  console.log('📱 UA:', ua);
  res.status(200).json({ status: 'logged' });
}
