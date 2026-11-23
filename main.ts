// news-image-20261123 — entry program for the make.fun bounty
// "Sum up 23 November's world news in one image" ($100).
//
// The entry image lives in this repository as entry.png (1024x1024,
// a dense newspaper front page of Monday 23 November 2026: 46
// stories, 13 pictured with original flat illustrations, a UTC
// timeline, a day-in-numbers strip, a pinned world map, 33
// one-line briefs, a DATE CHECK box and a verification footer).
// This program copies it byte-for-byte to /output/entry.png.
//
// Node 22, standard library only. No network, no randomness, no
// timestamps — every run writes exactly the same bytes.
//
// Usage: node main.ts [output-dir-or-file]
//   - no argument: writes /output/entry.png
//   - a directory: writes <dir>/entry.png
//   - a path ending in .png: writes that file
//   - OUTPUT_DIR env var is honoured when no argument is given.

import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");

// A trailing ".png" always means a file path; anything else is
// treated as a directory.
function resolveOutputPath(target) {
  const resolved = resolve(target);
  return resolved.endsWith(".png") ? resolved : join(resolved, "entry.png");
}

const target = process.argv[2] ?? process.env.OUTPUT_DIR ?? "/output";
const outputPath = resolveOutputPath(target);

mkdirSync(dirname(outputPath), { recursive: true });
copyFileSync(source, outputPath);

// Verify the copy landed whole: same byte count as the source image.
// A short write must fail loudly instead of shipping a broken entry.
const sourceBytes = statSync(source).size;
const outputBytes = statSync(outputPath).size;
if (outputBytes !== sourceBytes) {
  throw new Error(
    `Copy mismatch: wrote ${outputBytes} bytes, expected ${sourceBytes} bytes from ${source}`,
  );
}
console.log(`Wrote ${outputPath} (${outputBytes} bytes)`);
