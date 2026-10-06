const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8874694866:AAEmdXxd3DP3B8J4L2sHS0pIxVR98HV9vqI';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '8279465535';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sendTelegramMessage(text) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: false
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          resolve({ ok: res.statusCode === 200, raw: data });
        }
      });
    });

    req.on('error', (err) => {
      console.error('Telegram request error:', err);
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Telegram request timed out'));
    });

    req.write(postData);
    req.end();
  });
}

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

  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  // Handle Application Submission to Telegram Bot
  if (req.method === 'POST' && (rawPath === '/api/apply' || rawPath === '/api/apply/')) {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
      }
    });

    req.on('end', async () => {
      try {
        let data = {};
        if (body) {
          try {
            data = JSON.parse(body);
          } catch (e) {
            const qs = require('querystring');
            data = qs.parse(body);
          }
        }

        const name = data.name || 'Anonymous';
        const wa = data.wa || data.whatsapp || 'N/A';
        const em = data.em || data.email || 'N/A';
        const ex = data.ex || data.experience || 'Not specified';
        const skills = Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || 'None');
        const contentTypes = Array.isArray(data.content_types) ? data.content_types.join(', ') : (data.content_types || 'None');
        const portfolio = data.portfolio || data.portfolio_url || 'N/A';
        const about = data.about || data.notes || 'N/A';

        const nowStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka', dateStyle: 'medium', timeStyle: 'short' });

        const tgMessage = 
          `🎬 <b>NEW VIDEO EDITOR APPLICATION</b>\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `👤 <b>Name:</b> ${escapeHtml(name)}\n` +
          `📱 <b>WhatsApp:</b> ${escapeHtml(wa)}\n` +
          `✉️ <b>Email:</b> ${escapeHtml(em)}\n` +
          `💻 <b>Software:</b> Premiere Pro &amp; After Effects\n` +
          `⏳ <b>Experience:</b> ${escapeHtml(ex)}\n\n` +
          `⚡ <b>Skills:</b>\n${escapeHtml(skills)}\n\n` +
          `🎯 <b>Content Styles:</b>\n${escapeHtml(contentTypes)}\n\n` +
          `🔗 <b>Portfolio / Reel:</b>\n${escapeHtml(portfolio)}\n\n` +
          `📝 <b>Workflow &amp; PC Specs:</b>\n${escapeHtml(about)}\n\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `✅ <i>Agreed to Studio Terms &amp; Strict Deadlines</i>\n` +
          `🕒 <i>Submitted: ${nowStr} (BST)</i>`;

        try {
          await sendTelegramMessage(tgMessage);
        } catch (tgErr) {
          console.error('Failed to dispatch telegram notification:', tgErr);
        }

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ ok: true, message: 'Application received and forwarded to Telegram.' }));
      } catch (err) {
        console.error('Error handling /api/apply:', err);
        res.writeHead(500, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ ok: false, error: 'Server error processing application' }));
      }
    });
    return;
  }

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
