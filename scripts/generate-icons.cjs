const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. Regular icon SVG (for "any" purpose, favicon, and preview)
const anyIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b" />
      <stop offset="50%" stop-color="#047857" />
      <stop offset="100%" stop-color="#065f46" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="40%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>
    <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffbeb" />
      <stop offset="30%" stop-color="#fde047" />
      <stop offset="70%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#022c22" flood-opacity="0.45" />
    </filter>
    <filter id="coinShadow" x="-20%" y="-20%" width="150%" height="150%">
      <feDropShadow dx="2" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Background with smooth rounded corners -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />

  <!-- Decorative Islamic Geometric Circular Border -->
  <circle cx="256" cy="256" r="218" fill="none" stroke="#10b981" stroke-width="4" stroke-opacity="0.35" stroke-dasharray="8 8" />
  <circle cx="256" cy="256" r="206" fill="none" stroke="#fde047" stroke-width="3" stroke-opacity="0.4" />

  <!-- Outer Crescent / Decorative Accent -->
  <path d="M 256 62 A 194 194 0 0 1 450 256 A 194 194 0 0 0 270 90 A 194 194 0 0 1 256 62 Z" fill="#fde047" opacity="0.3" />

  <!-- Center Treasury Ledger Book -->
  <g filter="url(#shadow)" transform="translate(110, 116)">
    <!-- Book Shadow & Back cover -->
    <rect x="18" y="18" width="220" height="236" rx="20" fill="#022c22" opacity="0.5" />
    <!-- Book Main Body -->
    <rect x="10" y="10" width="224" height="234" rx="20" fill="#ffffff" stroke="#10b981" stroke-width="4" />
    <!-- Book Inner Page -->
    <rect x="24" y="24" width="196" height="206" rx="14" fill="#f0fdf4" />
    <!-- Book Spine -->
    <path d="M 24 16 L 24 238" stroke="#047857" stroke-width="12" stroke-linecap="round" />
    <!-- Bookmark Gold Ribbon -->
    <path d="M 120 10 L 120 80 L 132 68 L 144 80 L 144 10 Z" fill="url(#goldGrad)" />
    <!-- Ledger Entry Lines -->
    <line x1="56" y1="92" x2="188" y2="92" stroke="#047857" stroke-width="8" stroke-linecap="round" />
    <line x1="56" y1="130" x2="160" y2="130" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" />
    <line x1="56" y1="164" x2="188" y2="164" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" />
    <line x1="56" y1="198" x2="140" y2="198" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" />
  </g>

  <!-- Big Gleaming Golden Taka (৳) Coin in Foreground -->
  <g filter="url(#coinShadow)" transform="translate(268, 252)">
    <!-- Coin Outer Rim -->
    <circle cx="76" cy="76" r="74" fill="#b45309" />
    <circle cx="74" cy="74" r="72" fill="url(#coinGrad)" stroke="#fef08a" stroke-width="5" />
    <!-- Coin Beaded Inner Rim -->
    <circle cx="74" cy="74" r="56" fill="none" stroke="#b45309" stroke-width="3" stroke-dasharray="5 5" opacity="0.6" />
    
    <!-- Bengali Taka Symbol (৳) crafted with crisp vector paths -->
    <g transform="translate(42, 38)">
      <!-- Top horizontal bar / loop -->
      <path d="M 16 28 C 16 14, 28 8, 44 8 C 58 8, 68 16, 68 28 C 68 40, 56 46, 44 48 C 30 50, 16 56, 16 72" fill="none" stroke="#78350f" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Lower loop & stem -->
      <path d="M 16 72 C 16 82, 28 88, 44 88 C 60 88, 68 76, 68 62" fill="none" stroke="#78350f" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Taka Cross diagonal / vertical slash -->
      <line x1="8" y1="38" x2="56" y2="38" stroke="#78350f" stroke-width="7" stroke-linecap="round" />
    </g>
  </g>

  <!-- Top Islamic Crescent Star Emblem (Golden) -->
  <g transform="translate(236, 46)">
    <!-- Mini star -->
    <polygon points="20,0 25,12 38,12 28,20 32,32 20,24 8,32 12,20 2,12 15,12" fill="url(#goldGrad)" />
  </g>
</svg>
`;

// 2. Maskable Icon SVG (Strictly 512x512 full bleed background, no rounded corners, all content safely inside 80% circle)
const maskableIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="maskBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b" />
      <stop offset="50%" stop-color="#047857" />
      <stop offset="100%" stop-color="#065f46" />
    </linearGradient>
    <linearGradient id="maskGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="40%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>
    <linearGradient id="maskCoinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffbeb" />
      <stop offset="30%" stop-color="#fde047" />
      <stop offset="70%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <filter id="mShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#022c22" flood-opacity="0.45" />
    </filter>
    <filter id="mCoinShadow" x="-20%" y="-20%" width="150%" height="150%">
      <feDropShadow dx="2" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Full-bleed background with NO rounded corners (100% maskable compliant) -->
  <rect width="512" height="512" fill="url(#maskBgGrad)" />

  <!-- Safe Zone Visual Guide: Content scaled down 82% to fit safe inner circle (center 256, 256) -->
  <g transform="translate(256, 256) scale(0.8) translate(-256, -256)">
    <!-- Decorative Islamic Geometric Circular Border -->
    <circle cx="256" cy="256" r="218" fill="none" stroke="#10b981" stroke-width="4" stroke-opacity="0.35" stroke-dasharray="8 8" />
    <circle cx="256" cy="256" r="206" fill="none" stroke="#fde047" stroke-width="3" stroke-opacity="0.4" />

    <!-- Center Treasury Ledger Book -->
    <g filter="url(#mShadow)" transform="translate(110, 116)">
      <rect x="18" y="18" width="220" height="236" rx="20" fill="#022c22" opacity="0.5" />
      <rect x="10" y="10" width="224" height="234" rx="20" fill="#ffffff" stroke="#10b981" stroke-width="4" />
      <rect x="24" y="24" width="196" height="206" rx="14" fill="#f0fdf4" />
      <path d="M 24 16 L 24 238" stroke="#047857" stroke-width="12" stroke-linecap="round" />
      <path d="M 120 10 L 120 80 L 132 68 L 144 80 L 144 10 Z" fill="url(#maskGoldGrad)" />
      <line x1="56" y1="92" x2="188" y2="92" stroke="#047857" stroke-width="8" stroke-linecap="round" />
      <line x1="56" y1="130" x2="160" y2="130" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" />
      <line x1="56" y1="164" x2="188" y2="164" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" />
      <line x1="56" y1="198" x2="140" y2="198" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" />
    </g>

    <!-- Big Gleaming Golden Taka (৳) Coin in Foreground -->
    <g filter="url(#mCoinShadow)" transform="translate(268, 252)">
      <circle cx="76" cy="76" r="74" fill="#b45309" />
      <circle cx="74" cy="74" r="72" fill="url(#maskCoinGrad)" stroke="#fef08a" stroke-width="5" />
      <circle cx="74" cy="74" r="56" fill="none" stroke="#b45309" stroke-width="3" stroke-dasharray="5 5" opacity="0.6" />
      <g transform="translate(42, 38)">
        <path d="M 16 28 C 16 14, 28 8, 44 8 C 58 8, 68 16, 68 28 C 68 40, 56 46, 44 48 C 30 50, 16 56, 16 72" fill="none" stroke="#78350f" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M 16 72 C 16 82, 28 88, 44 88 C 60 88, 68 76, 68 62" fill="none" stroke="#78350f" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" />
        <line x1="8" y1="38" x2="56" y2="38" stroke="#78350f" stroke-width="7" stroke-linecap="round" />
      </g>
    </g>

    <!-- Top Star Emblem -->
    <g transform="translate(236, 46)">
      <polygon points="20,0 25,12 38,12 28,20 32,32 20,24 8,32 12,20 2,12 15,12" fill="url(#maskGoldGrad)" />
    </g>
  </g>
</svg>
`;

async function generateAllIcons() {
  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Write the SVG file
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), anyIconSvg.trim());
  console.log('✅ Generated public/icon.svg');

  // 2. Generate standard PNGs
  const standardBuffer = Buffer.from(anyIconSvg);
  const maskableBuffer = Buffer.from(maskableIconSvg);

  // 192x192 PNG (Standard PWA Chrome requirement)
  await sharp(standardBuffer)
    .resize(192, 192)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('✅ Generated public/pwa-192x192.png (192x192)');

  // 512x512 PNG (Standard PWA Chrome requirement)
  await sharp(standardBuffer)
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('✅ Generated public/pwa-512x512.png (512x512)');

  // 512x512 Maskable PNG (Android Chrome requirement)
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('✅ Generated public/pwa-maskable-512x512.png (512x512 Maskable)');

  // 180x180 Apple Touch Icon (iOS Safari requirement)
  await sharp(standardBuffer)
    .resize(180, 180)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✅ Generated public/apple-touch-icon.png (180x180)');

  // 64x64 Favicon
  await sharp(standardBuffer)
    .resize(64, 64)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('✅ Generated public/favicon.png (64x64)');
}

generateAllIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
