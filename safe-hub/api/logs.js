export default async function handler(req, res) {
  const { page = 1, pageSize = 10, filter = '' } = req.query;

  const sheetUrl = `https://script.google.com/macros/s/AKfycbxZlHcLl9t52DBXSyDwxaK6QHsVMDzNRAIMxRYVyluSRK__YsfCz20xdwx6YqRWYgiV/exec?page=${page}&pageSize=${pageSize}&filter=${filter}`;

  try {
    const response = await fetch(sheetUrl);
    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch logs', detail: err.message });
  }
}
