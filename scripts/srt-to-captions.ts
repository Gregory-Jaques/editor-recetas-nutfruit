#!/usr/bin/env npx tsx
/**
 * Convert SRT subtitle file to Remotion captions JSON format.
 * Usage: npx tsx scripts/srt-to-captions.ts input.srt output.json
 */
import {readFileSync, writeFileSync} from "fs";
import path from "path";

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  console.error("Usage: npx tsx scripts/srt-to-captions.ts input.srt output.json");
  process.exit(1);
}

function srtTimeToMs(time: string): number {
  const [hms, ms] = time.trim().split(",");
  const [h, m, s] = hms.split(":").map(Number);
  return h * 3_600_000 + m * 60_000 + s * 1_000 + Number(ms);
}

const srt = readFileSync(inputPath, "utf-8").replace(/\r\n/g, "\n");
const blocks = srt.trim().split(/\n\n+/);

const captions: {text: string; startMs: number; endMs: number}[] = [];

for (const block of blocks) {
  const lines = block.trim().split("\n");
  if (lines.length < 3) continue;
  // line 0: index, line 1: timecode, line 2+: text
  const timeLine = lines[1];
  const textLines = lines.slice(2).join(" ").trim();
  const [startRaw, endRaw] = timeLine.split("-->").map((s) => s.trim());
  captions.push({
    text: " " + textLines,   // leading space = new word token for mergeSubTokens
    startMs: srtTimeToMs(startRaw),
    endMs: srtTimeToMs(endRaw),
  });
}

writeFileSync(outputPath, JSON.stringify(captions, null, 2));
console.log(`Converted ${captions.length} entries → ${outputPath}`);
