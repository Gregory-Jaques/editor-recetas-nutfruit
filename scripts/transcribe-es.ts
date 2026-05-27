#!/usr/bin/env npx tsx
/**
 * Transcribe Spanish audio using Whisper medium (multilingual) model.
 * Usage: npx tsx scripts/transcribe-es.ts <audio.wav> <output.json>
 */
import path from "path";
import {writeFileSync, existsSync} from "fs";

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  console.error("Usage: npx tsx scripts/transcribe-es.ts <audio.wav> <output.json>");
  process.exit(1);
}

const absInput = path.resolve(inputPath);
const absOutput = path.resolve(outputPath);
const whisperPath = path.join(process.cwd(), "whisper.cpp");
const WHISPER_VERSION = "1.5.5";

if (!existsSync(absInput)) {
  console.error(`Audio file not found: ${absInput}`);
  process.exit(1);
}

async function main() {
  const {
    installWhisperCpp,
    downloadWhisperModel,
    transcribe,
    toCaptions,
  } = await import("@remotion/install-whisper-cpp");

  console.log("Installing Whisper.cpp (first time only)...");
  const {alreadyExisted} = await installWhisperCpp({
    to: whisperPath,
    version: WHISPER_VERSION,
  });
  console.log(alreadyExisted ? "Whisper.cpp already installed" : "Whisper.cpp installed");

  console.log("Downloading multilingual medium model...");
  await downloadWhisperModel({
    model: "medium",
    folder: whisperPath,
  });
  console.log("Model ready");

  console.log(`Transcribing (Spanish): ${absInput}`);
  const whisperOutput = await transcribe({
    model: "medium",
    whisperPath,
    whisperCppVersion: WHISPER_VERSION,
    inputPath: absInput,
    tokenLevelTimestamps: true,
    language: "es",
  });

  const {captions} = toCaptions({whisperCppOutput: whisperOutput});

  writeFileSync(absOutput, JSON.stringify(captions, null, 2));
  console.log(`Saved ${captions.length} captions -> ${absOutput}`);
  if (captions.length > 0) {
    console.log(`First: "${captions[0].text.trim()}" (${captions[0].startMs}ms)`);
    const last = captions[captions.length - 1];
    console.log(`Last: "${last.text.trim()}" (${last.endMs}ms)`);
  }
}

main().catch((err) => {
  console.error("Transcription failed:", err.message);
  process.exit(1);
});
