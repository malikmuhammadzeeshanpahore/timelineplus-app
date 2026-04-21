const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server with custom application logic
const proxy = httpProxy.createProxyServer({});

const FRONTEND_URL = 'http://localhost:5173';
const BACKEND_URL = 'http://localhost:5000';
const PORT = 8080;

const server = http.createServer(function (req, res) {
    // Log request for debugging
    console.log(`Request: ${req.method} ${req.url}`);

    if (req.url.startsWith('/api') || req.url.startsWith('/uploads')) {
        // Route API and Uploads to Backend (5000)
        proxy.web(req, res, { target: BACKEND_URL }, (err) => {
            console.error('Backend Proxy Error:', err);
            res.writeHead(502, { 'Content-Type': 'text/plain' });
            res.end('Backend Unavailable');
        });
    } else {
        // Route everything else to Frontend (5173) - Vite
        proxy.web(req, res, { target: FRONTEND_URL }, (err) => {
            console.error('Frontend Proxy Error:', err);
            res.writeHead(502, { 'Content-Type': 'text/plain' });
            res.end('Frontend Unavailable');
        });
    }
});

// Handle upgrade (WebSockets) for Vite HMR
server.on('upgrade', function (req, socket, head) {
    if (req.url.startsWith('/api')) {
        proxy.ws(req, socket, head, { target: BACKEND_URL });
    } else {
        proxy.ws(req, socket, head, { target: FRONTEND_URL });
    }
});

console.log(`Reverse Proxy running on http://0.0.0.0:${PORT}`);
console.log(`- /api/*    -> ${BACKEND_URL}`);
console.log(`- /*        -> ${FRONTEND_URL}`);

server.listen(PORT, '0.0.0.0');
