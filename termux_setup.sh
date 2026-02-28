#!/data/data/com.termux/files/usr/bin/bash
# ╔══════════════════════════════════════════════════════════════╗
# ║        ECHOAI v4.0 — TERMUX SETUP SCRIPT                    ║
# ║  Paste this ENTIRE script into Termux and press Enter        ║
# ║  It creates ALL backend files automatically                  ║
# ╚══════════════════════════════════════════════════════════════╝

set -e
echo ""
echo "  ██████╗  ██████╗ ██╗  ██╗ ██████╗  █████╗ ██╗"
echo "  ██╔════╝██╔════╝ ██║  ██║██╔═══██╗██╔══██╗██║"
echo "  █████╗  ██║      ███████║██║   ██║███████║██║"
echo "  ██╔══╝  ██║      ██╔══██║██║   ██║██╔══██║██║"
echo "  ███████╗╚██████╗ ██║  ██║╚██████╔╝██║  ██║██║"
echo "  ╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝"
echo ""
echo "  Setting up ECHOAI in Termux..."
echo ""

# Setup storage
termux-setup-storage 2>/dev/null || true

# Create project folder
mkdir -p ~/echoai
cd ~/echoai

echo "✓ Created ~/echoai folder"

# ── package.json ──────────────────────────────────────────────
cat > package.json << 'PKGJSON'
{
  "name": "echoai",
  "version": "4.0.0",
  "description": "ECHOAI - Self-Evolving AI Companion",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "ws": "^8.16.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
PKGJSON
echo "✓ Created package.json"

# ── .gitignore ────────────────────────────────────────────────
cat > .gitignore << 'GITIGNORE'
node_modules/
data.json
logs/
*.tgz
*.log
.env
ngrok*
GITIGNORE
echo "✓ Created .gitignore"

# ── .env.example ──────────────────────────────────────────────
cat > .env.example << 'ENVEXAMPLE'
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=EchoAiZambia2026SuperSecret!
PORT=6400
ENVEXAMPLE
echo "✓ Created .env.example"

# ── sw.js ─────────────────────────────────────────────────────
cat > sw.js << 'SWJS'
const CACHE = 'echoai-v4';
const STATIC = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC).catch(() => {})));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) { const c = res.clone(); caches.open(CACHE).then(ca => ca.put(e.request, c)); }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
self.addEventListener('push', e => {
  const d = e.data ? e.data.json() : { title: 'ECHOAI', body: 'New notification' };
  e.waitUntil(self.registration.showNotification(d.title || 'ECHOAI', {
    body: d.body || '', icon: '/icon-192.png', badge: '/icon-192.png',
    vibrate: [200, 100, 200], data: d
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});
SWJS
echo "✓ Created sw.js"

# ── manifest.json ─────────────────────────────────────────────
cat > manifest.json << 'MANIFEST'
{
  "name": "ECHOAI",
  "short_name": "ECHOAI",
  "description": "Your self-evolving AI companion",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#050508",
  "theme_color": "#00e5ff",
  "orientation": "portrait-primary",
  "prefer_related_applications": false,
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "shortcuts": [
    { "name": "Chat with ECHOAI", "short_name": "Chat", "url": "/?panel=chat", "icons": [{"src": "/icon-192.png", "sizes": "192x192"}] }
  ],
  "share_target": {
    "action": "/",
    "method": "GET",
    "params": { "title": "title", "text": "text", "url": "url" }
  }
}
MANIFEST
echo "✓ Created manifest.json"

# ── render.yaml (not needed for GitHub+Termux but kept for reference) ──
cat > render.yaml << 'RENDERYAML'
# render.yaml — only needed if deploying to Render.com (not needed for GitHub+Termux)
services:
  - type: web
    name: echoai
    env: node
    plan: free
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: PORT
        value: 10000
      - key: GEMINI_API_KEY
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: RENDER
        value: true
RENDERYAML
echo "✓ Created render.yaml"

# ── Install npm packages ──────────────────────────────────────
echo ""
echo "📦 Installing packages (express, ws, dotenv)..."
npm install
echo "✓ Packages installed"

# ── Create icons using Python ─────────────────────────────────
echo ""
echo "🎨 Generating app icons..."
python3 << 'ICONPY'
try:
    from PIL import Image, ImageDraw, ImageFilter, ImageFont
    import math

    def make_icon(size):
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        # Background circle
        draw.ellipse([0,0,size-1,size-1], fill=(5,5,12,255))
        # Glow layers
        cx = cy = size // 2
        for i in range(8):
            r = size//2 - i*(size//24)
            a = max(20, 80 - i*8)
            draw.ellipse([cx-r,cy-r,cx+r,cy+r], fill=(0,100,180,a))
        # Core
        cr = size//10
        draw.ellipse([cx-cr,cy-cr,cx+cr,cy+cr], fill=(0,229,255,255))
        draw.ellipse([cx-cr//2,cy-cr//2,cx+cr//2,cy+cr//2], fill=(200,240,255,255))
        # Orbital dots
        for angle in range(0,360,60):
            rad = math.radians(angle)
            pr = size//3
            px = int(cx + pr*math.cos(rad))
            py = int(cy + pr*math.sin(rad))
            dr = max(3, size//32)
            draw.ellipse([px-dr,py-dr,px+dr,py+dr], fill=(0,229,255,220))
        # Ring
        draw.ellipse([cx-size//3,cy-size//3,cx+size//3,cy+size//3], outline=(0,229,255,80), width=max(1,size//64))
        # Apply circle mask
        mask = Image.new('L', (size,size), 0)
        ImageDraw.Draw(mask).ellipse([0,0,size-1,size-1], fill=255)
        img.putalpha(mask)
        return img

    make_icon(192).save('icon-192.png')
    make_icon(512).save('icon-512.png')
    print("✓ Icons created with PIL")
except ImportError:
    # Fallback: minimal valid PNG using raw bytes
    import struct, zlib
    def minimal_png(size, r, g, b):
        def chunk(name, data):
            c = zlib.crc32(name + data) & 0xffffffff
            return struct.pack('>I', len(data)) + name + data + struct.pack('>I', c)
        ihdr = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)
        row = bytes([0] + [r, g, b] * size)
        idat = zlib.compress(row * size)
        return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', idat) + chunk(b'IEND', b'')
    with open('icon-192.png','wb') as f: f.write(minimal_png(192,0,229,255))
    with open('icon-512.png','wb') as f: f.write(minimal_png(512,0,229,255))
    print("✓ Minimal icons created (install Pillow for better icons: pip install Pillow --break-system-packages)")
ICONPY

echo ""
echo "══════════════════════════════════════════════"
echo "  ✅ SETUP COMPLETE!"
echo "══════════════════════════════════════════════"
echo ""
echo "  Files created:"
ls -la ~/echoai/
echo ""
echo "  NEXT STEPS:"
echo ""
echo "  1. Add your Gemini API key:"
echo "     echo 'GEMINI_API_KEY=AIzaSy...' > ~/.env"
echo "     echo 'JWT_SECRET=MySecretKey2026!' >> ~/.env"
echo "     cp ~/.env ~/echoai/.env"
echo ""
echo "  2. Copy index.html from GitHub to this folder:"
echo "     (Upload index.html to GitHub first, then:)"
echo "     cp ~/storage/downloads/index.html ~/echoai/"
echo "     OR: create it directly on GitHub.com"
echo ""
echo "  3. Start the server:"
echo "     cd ~/echoai && node server.js"
echo ""
echo "  4. Start the tunnel (new Termux session):"
echo "     cloudflared tunnel --url http://localhost:6400"
echo ""
echo "  5. Open your GitHub Pages URL in Chrome"
echo "     Paste the cloudflared URL when asked"
echo "══════════════════════════════════════════════"
