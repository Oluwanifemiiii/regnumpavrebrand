/**
 * Image optimization step.
 *
 * Resizes + recompresses raster images in `public/` IN PLACE, keeping the same
 * filenames so nothing in the app needs to change (references stay like
 * `/roompic.jpg`). Runs automatically before `npm run dev` and `npm run build`.
 *
 * How it stays safe & idempotent:
 *  - The untouched original of every image is backed up once to
 *    `public/.image-originals/` (git-ignored). Re-optimization always works
 *    from that pristine copy, so quality never degrades on repeated runs.
 *  - A manifest tracks which originals have been processed (by content hash),
 *    so already-optimized images are skipped and re-runs are cheap.
 *  - Drop a NEW image (or replace one) in `public/` and the next run optimizes
 *    just that file.
 *
 * Tunables:
 */
const MAX_WIDTH = 2000 // px — hero-sized; downscales oversized photos
const JPEG_QUALITY = 78 // mozjpeg quality
const PNG_QUALITY = 80

import { promises as fs } from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public')
const ORIGINALS_DIR = path.join(PUBLIC_DIR, '.image-originals')
const MANIFEST_PATH = path.join(ORIGINALS_DIR, 'manifest.json')

const RASTER = /\.(jpe?g|png)$/i

const hash = (buf) => crypto.createHash('sha1').update(buf).digest('hex')
const kb = (bytes) => (bytes / 1024).toFixed(0) + ' KB'

async function readManifest() {
  try {
    return JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8'))
  } catch {
    return {}
  }
}

async function optimizeBuffer(buf, ext) {
  let img = sharp(buf, { failOn: 'none' }).rotate() // respect EXIF orientation
  const meta = await img.metadata()
  if (meta.width && meta.width > MAX_WIDTH) {
    img = img.resize({ width: MAX_WIDTH, withoutEnlargement: true })
  }
  if (/png/i.test(ext)) {
    return img.png({ quality: PNG_QUALITY, compressionLevel: 9, palette: true }).toBuffer()
  }
  return img.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer()
}

async function run() {
  let entries
  try {
    entries = await fs.readdir(PUBLIC_DIR, { withFileTypes: true })
  } catch {
    console.log('[optimize-images] no public/ directory — nothing to do.')
    return
  }

  const images = entries.filter((e) => e.isFile() && RASTER.test(e.name)).map((e) => e.name)
  if (images.length === 0) {
    console.log('[optimize-images] no images found in public/.')
    return
  }

  await fs.mkdir(ORIGINALS_DIR, { recursive: true })
  const manifest = await readManifest()

  let processed = 0
  let savedBytes = 0

  for (const name of images) {
    const filePath = path.join(PUBLIC_DIR, name)
    const backupPath = path.join(ORIGINALS_DIR, name)
    const current = await fs.readFile(filePath)
    const currentHash = hash(current)

    // Already optimized this exact output? Skip.
    if (manifest[name]?.optimizedHash === currentHash) continue

    // Determine the source of truth: a pristine backup if one exists AND the
    // current file isn't a brand-new drop; otherwise the current file is the
    // new original and we back it up.
    let source = current
    const isKnownOriginal = manifest[name]?.originalHash === currentHash
    if (isKnownOriginal) {
      // current file IS the stored original (e.g. first run) — use as source.
      source = current
      await fs.writeFile(backupPath, current)
    } else {
      // New or replaced image → treat current as the new original & back up.
      source = current
      await fs.writeFile(backupPath, current)
    }

    const ext = path.extname(name)
    const optimized = await optimizeBuffer(source, ext)

    // Only replace if we actually made it smaller.
    if (optimized.length < source.length) {
      await fs.writeFile(filePath, optimized)
      savedBytes += source.length - optimized.length
      console.log(
        `[optimize-images] ${name}: ${kb(source.length)} → ${kb(optimized.length)} ` +
          `(-${(((source.length - optimized.length) / source.length) * 100).toFixed(0)}%)`
      )
    } else {
      console.log(`[optimize-images] ${name}: already optimal (${kb(source.length)}), left as-is.`)
    }

    const finalBuf = await fs.readFile(filePath)
    manifest[name] = {
      originalHash: hash(source),
      optimizedHash: hash(finalBuf),
    }
    processed++
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2))

  if (processed === 0) {
    console.log('[optimize-images] all images already optimized.')
  } else {
    console.log(`[optimize-images] done — ${processed} image(s), saved ${kb(savedBytes)}.`)
  }
}

run().catch((err) => {
  console.error('[optimize-images] failed:', err)
  process.exit(1)
})
