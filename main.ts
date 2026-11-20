// gta6-clipper-01 v2 entry point (Node 22, standard library only).
//
// The entry is the YouTube video itself: this program only hands the gate
// the video's address. It reads VIDEO.json from the repository root and
// writes an identical copy to the output directory, where the grader
// picks it up and reads the video's views through the YouTube Data API.
//
// No network, no clock, no files outside this repository: given the same
// VIDEO.json, both runs write the same bytes.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });

const videoPath = join(botDir, "VIDEO.json");
let videoUrl;
try {
  const parsed = JSON.parse(readFileSync(videoPath, "utf8"));
  videoUrl = parsed?.url;
} catch (error) {
  console.error(`Could not read VIDEO.json from ${botDir}: ${(error as Error).message}`);
  process.exit(1);
}

// The gate reads the video's views through the YouTube Data API, so refuse
// to hand it anything that is not a YouTube Shorts address instead of
// silently copying a bad link through.
if (typeof videoUrl !== "string" || !/^https:\/\/(www\.)?youtube\.com\/shorts\/[A-Za-z0-9_-]+$/.test(videoUrl)) {
  console.error(`VIDEO.json does not name a YouTube Shorts video: ${JSON.stringify(videoUrl)}`);
  process.exit(1);
}

try {
  copyFileSync(videoPath, join(outputDir, "VIDEO.json"));
} catch (error) {
  console.error(
    `Could not copy VIDEO.json out of ${botDir}: ${(error as Error).message}`,
  );
  process.exit(1);
}
