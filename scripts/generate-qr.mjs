// Usage: node scripts/generate-qr.mjs [url]
// Writes a print-ready static QR (SVG + 2000px PNG) to public/qr/.
import QRCode from 'qrcode'
import { mkdirSync } from 'node:fs'

const url = process.argv[2] || 'https://regnumpav.com/menu'
mkdirSync('public/qr', { recursive: true })
const opts = { errorCorrectionLevel: 'H', margin: 4, color: { dark: '#1a1714', light: '#ffffff' } }
await QRCode.toFile('public/qr/menu-qr.svg', url, { ...opts, type: 'svg' })
await QRCode.toFile('public/qr/menu-qr.png', url, { ...opts, type: 'png', width: 2000 })
console.log('QR generated for', url)
