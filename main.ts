// 17 November 2026, world news in one image: entry.png sits beside this file and is copied to the
// grader's /output/entry.png. Node 22, standard library only, no network.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const LIMIT = 1048576; // the gate's 1 MiB cap
const image = new URL('./entry.png', import.meta.url);
const bytes = statSync(image).size;
if (bytes > LIMIT) throw new Error(`entry.png is ${bytes} bytes, over the ${LIMIT}-byte limit`);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const out = join(outDir, 'entry.png');
copyFileSync(image, out);
console.log(`wrote ${out} (${bytes} bytes)`);
