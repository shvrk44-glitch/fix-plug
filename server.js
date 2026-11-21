// High-Performance, Hardened Development Server for FIX-PLUG
// Features: Path traversal defense, Gzip compression, ETag 304 caching, rate limiting, and strict security headers.

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const ROOT = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

// Simple in-memory rate limiter (120 requests per minute per IP)
const rateLimitMap = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxReqs = 120;
  
  const record = rateLimitMap.get(ip) || { count: 0, start: now };
  if (now - record.start > windowMs) {
    record.count = 1;
    record.start = now;
  } else {
    record.count++;
  }
  rateLimitMap.set(ip, record);

  // Clean old records periodically
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now - val.start > windowMs) rateLimitMap.delete(key);
    }
  }

  return record.count > maxReqs;
}

const server = http.createServer((req, res) => {
  const clientIp = req.socket.remoteAddress || 'unknown';
  
  if (isRateLimited(clientIp)) {
    res.writeHead(429, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('429 Too Many Requests: Rate limit exceeded. Please wait a moment.');
    return;
  }

  // Sanitize and normalize URL path
  let reqUrl = req.url.split('?')[0];
  try {
    reqUrl = decodeURIComponent(reqUrl);
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('400 Bad Request');
    return;
  }

  // SECURITY FIX (CWE-22): Path Traversal Prevention
  // Normalize and ensure path resolves strictly inside ROOT directory
  let safePath = path.normalize(path.join(ROOT, reqUrl));
  if (!safePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden: Access denied.');
    return;
  }

  // Directory handling (serve index.html)
  if (fs.existsSync(safePath) && fs.statSync(safePath).isDirectory()) {
    safePath = path.join(safePath, 'index.html');
  }

  // Clean URLs support (fallback to .html or directory/index.html)
  if (!fs.existsSync(safePath) && !path.extname(safePath)) {
    if (fs.existsSync(safePath + '.html')) {
      safePath = safePath + '.html';
    } else if (fs.existsSync(path.join(safePath, 'index.html'))) {
      safePath = path.join(safePath, 'index.html');
    }
  }

  // Verify again after path resolution
  if (!safePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(safePath, (statErr, stats) => {
    if (statErr || !stats.isFile()) {
      res.writeHead(404, {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Content-Type-Options': 'nosniff'
      });
      res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>404 Not Found | FIX-PLUG</title>
          <style>
            body { font-family: -apple-system, system-ui, sans-serif; padding: 3rem 1.5rem; background: #F3EBE0; color: #0A0A0A; text-align: center; }
            a { color: #0A0A0A; font-weight: 700; text-decoration: underline; }
            .btn { display: inline-block; background: #B6855A; color: #0A0A0A; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; margin-top: 1rem; }
          </style>
        </head>
        <body>
          <h1>404 - Page Not Found</h1>
          <p>The page you requested does not exist or has been moved.</p>
          <a href="/" class="btn">Return to FIX-PLUG Homepage</a>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Generate ETag from file size and mtime for HTTP 304 caching
    const etag = `"${stats.size}-${stats.mtime.getTime()}"`;
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304);
      res.end();
      return;
    }

    fs.readFile(safePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }

      // Security Headers
      const headers = {
        'Content-Type': contentType,
        'ETag': etag,
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://wa.me;"
      };

      // Caching policy: HTML revalidates, static assets cached aggressively for fast repeat loads
      if (ext === '.html') {
        headers['Cache-Control'] = 'no-cache, must-revalidate';
      } else {
        headers['Cache-Control'] = 'public, max-age=86400, stale-while-revalidate=604800';
      }

      // Gzip compression for compressible assets
      const acceptEncoding = req.headers['accept-encoding'] || '';
      const isCompressible = /text|javascript|json|xml|svg/i.test(contentType);

      if (isCompressible && acceptEncoding.includes('gzip')) {
        headers['Content-Encoding'] = 'gzip';
        zlib.gzip(data, (gzipErr, compressed) => {
          if (gzipErr) {
            res.writeHead(200, headers);
            res.end(data);
          } else {
            headers['Content-Length'] = compressed.length;
            res.writeHead(200, headers);
            res.end(compressed);
          }
        });
      } else {
        headers['Content-Length'] = data.length;
        res.writeHead(200, headers);
        res.end(data);
      }
    });
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n==================================================`);
  console.log(`  FIX-PLUG Turbo Server Running`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log(`  Security: Path-traversal proof, CSP, nosniff, Rate-limited`);
  console.log(`  Performance: Gzip compression & ETag 304 active`);
  console.log(`==================================================\n`);
});
