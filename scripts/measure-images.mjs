#!/usr/bin/env node
/**
 * Measure natural width/height for every image referenced by case studies
 * and bake the result into src/data/projects.ts between the auto-generated
 * sentinel comments. The justified gallery uses these dimensions to lay out
 * rows at build time — no runtime `new Image()` probing, no CLS.
 *
 *   node scripts/measure-images.mjs
 *
 * Idempotent. Run after adding/replacing webp files in public/images/work/.
 */

import { readdir, readFile, writeFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { imageSize } from 'image-size'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const WORK_DIR = join(REPO_ROOT, 'public', 'images', 'work')
const PROJECTS_FILE = join(REPO_ROOT, 'src', 'data', 'projects.ts')

const START = '// >>> begin auto-generated image dimensions — do not edit by hand'
const END = '// <<< end auto-generated image dimensions'
const HINT = '//     run `npm run measure-images` to regenerate'

async function main() {
  if (!existsSync(WORK_DIR)) {
    console.error(`error: image directory not found: ${WORK_DIR}`)
    process.exit(1)
  }
  if (!existsSync(PROJECTS_FILE)) {
    console.error(`error: projects file not found: ${PROJECTS_FILE}`)
    process.exit(1)
  }

  const files = (await readdir(WORK_DIR))
    .filter((f) => f.toLowerCase().endsWith('.webp'))
    .sort()

  const entries = []
  for (const f of files) {
    const path = join(WORK_DIR, f)
    const buf = await readFile(path)
    const dim = imageSize(buf)
    if (!dim.width || !dim.height) {
      console.error(`error: could not read dimensions: ${f}`)
      process.exit(1)
    }
    const size = (await stat(path)).size
    entries.push({ key: `/images/work/${f}`, w: dim.width, h: dim.height, bytes: size })
  }

  const lines = [
    START,
    HINT,
    `export const imageDimensions: Record<string, { w: number; h: number }> = {`,
    ...entries.map((e) => `  '${e.key}': { w: ${e.w}, h: ${e.h} },`),
    `}`,
    END,
  ]
  const block = lines.join('\n')

  let src = await readFile(PROJECTS_FILE, 'utf8')
  const startIdx = src.indexOf(START)
  const endIdx = src.indexOf(END)
  if (startIdx >= 0 && endIdx >= 0) {
    src = src.slice(0, startIdx) + block + src.slice(endIdx + END.length)
  } else {
    if (!src.endsWith('\n')) src += '\n'
    src += '\n' + block + '\n'
  }
  await writeFile(PROJECTS_FILE, src, 'utf8')

  const totalBytes = entries.reduce((a, e) => a + e.bytes, 0)
  console.log(`measured ${entries.length} images, ${(totalBytes / 1024 / 1024).toFixed(1)} MB total`)
  console.log(`wrote ${PROJECTS_FILE}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
