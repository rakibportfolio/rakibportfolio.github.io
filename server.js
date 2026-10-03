const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const [rawPath, rawQuery] = req.url.split('?');
  const queryStr = rawQuery ? `?${rawQuery}` : '';

  // 1. Redirect /index.html to clean root domain /
  if (rawPath === '/index.html') {
    res.writeHead(301, { 'Location': '/' + queryStr });
    res.end();
    return;
  }

  // 2. Redirect .html extension to clean path (e.g. /services.html -> /services)
  if (rawPath.endsWith('.html')) {
    const cleanPath = rawPath.replace(/\.html$/, '');
    res.writeHead(301, { 'Location': cleanPath + queryStr });
    res.end();
    return;
  }

  // 3. Resolve file path
  let reqUrl = rawPath === '/' ? '/index.html' : rawPath;
  try {
    reqUrl = decodeURIComponent(reqUrl);
  } catch (e) {}

  let filePath = path.join(__dirname, reqUrl);

  // If path is a clean directory or clean route, find corresponding html file
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    if (fs.existsSync(filePath + '.html') && fs.statSync(filePath + '.html').isFile()) {
      filePath = filePath + '.html';
    } else if (fs.existsSync(path.join(filePath, 'index.html')) && fs.statSync(path.join(filePath, 'index.html')).isFile()) {
      filePath = path.join(filePath, 'index.html');
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const range = req.headers.range;

    if (range && stats.size) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      file.pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Length': stats.size,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
