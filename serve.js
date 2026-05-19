const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 8091;
const certDir = '/root/.lightclaw/workspace/jingjitimer/certs';

const options = {
  key: fs.readFileSync(path.join(certDir, 'key.pem')),
  cert: fs.readFileSync(path.join(certDir, 'cert.pem'))
};

const MIME = {
  '.html': 'text/html','.js': 'application/javascript','.css': 'text/css',
  '.png': 'image/png','.jpg': 'image/jpeg','.svg': 'image/svg+xml',
  '.json': 'application/json','.csv': 'text/csv','.wasm': 'application/wasm'
};

https.createServer(options, (req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : decodeURIComponent(req.url));
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`FlowPose running at https://0.0.0.0:${PORT}`);
});
