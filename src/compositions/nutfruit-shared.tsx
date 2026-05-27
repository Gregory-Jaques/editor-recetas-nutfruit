import React, {useEffect, useMemo, useState} from "react";
import {
  staticFile,
  delayRender,
  continueRender,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import type {Caption} from "@remotion/captions";

export const FONT_FAMILY = "AsapCondensedMedium";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Word {
  text: string;
  startMs: number;
  endMs: number;
  isSentenceEnd: boolean;
}

export interface Page {
  startMs: number;
  words: Word[];
}

// ─── Caption processing ───────────────────────────────────────────────────────

const SENTENCE_ENDERS = /[.!?]/;
const BRACKET_OPEN = /^[\[(]$/;
const BRACKET_CLOSE = /^[\])]$/;
const SKIP_DISPLAY = /^[,;:.]$/;

export function mergeSubTokens(captions: Caption[]): Word[] {
  const words: Word[] = [];
  let inBracket = false;

  for (const cap of captions) {
    const t = cap.text;
    const trimmed = t.trim();

    if (BRACKET_OPEN.test(trimmed)) { inBracket = true; continue; }
    if (BRACKET_CLOSE.test(trimmed)) { inBracket = false; continue; }
    if (inBracket) continue;
    if (!trimmed) continue;

    const isPunct = SENTENCE_ENDERS.test(trimmed) || /^[,;:]$/.test(trimmed);
    const startsNewWord = t.startsWith(" ") || isPunct;

    if (startsNewWord || words.length === 0) {
      words.push({
        text: t,
        startMs: cap.startMs,
        endMs: cap.endMs,
        isSentenceEnd: SENTENCE_ENDERS.test(trimmed),
      });
    } else {
      const last = words[words.length - 1];
      last.text += t;
      last.endMs = cap.endMs;
      if (SENTENCE_ENDERS.test(trimmed)) last.isSentenceEnd = true;
    }
  }

  return words;
}

const PUNCT_ONLY = /^[.,;:!?]+$/;
const isRealWord = (w: Word) => !PUNCT_ONLY.test(w.text.trim());

/**
 * Builds short pages of N real words at a time (default 2).
 * - Always flushes at sentence end (.!?)
 * - Always flushes at pauses > 600ms
 * - Skips pages that contain only punctuation
 */
export function buildSentencePages(words: Word[], maxRealWords = 2): Page[] {
  const pages: Page[] = [];
  let buffer: Word[] = [];
  let realCount = 0;

  const flush = () => {
    if (buffer.length && buffer.some(isRealWord)) {
      pages.push({startMs: buffer[0].startMs, words: buffer});
    }
    buffer = [];
    realCount = 0;
  };

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const next = words[i + 1];
    buffer.push(w);
    if (isRealWord(w)) realCount++;

    const longPause = next ? next.startMs - w.endMs > 600 : false;
    const reachedMax = realCount >= maxRealWords;

    if (w.isSentenceEnd || longPause || reachedMax || !next) {
      flush();
    }
  }

  return pages;
}

// ─── Generic captions loader (custom path) ───────────────────────────────────

export function useRecipeCaptions(captionsPath: string) {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const [handle] = useState(() => delayRender(`Loading captions: ${captionsPath}`));

  useEffect(() => {
    fetch(staticFile(captionsPath))
      .then((r) => r.json())
      .then((data: Caption[]) => { setCaptions(data); continueRender(handle); })
      .catch(() => continueRender(handle));
  }, [captionsPath, handle]);

  return {captions};
}

// ─── Font + captions loader hook ─────────────────────────────────────────────

export function useNutfruitAssets() {
  const [fontReady, setFontReady] = useState(false);
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const [fontHandle] = useState(() => delayRender("Loading Asap Condensed Medium"));
  const [captionHandle] = useState(() => delayRender("Loading captions"));

  useEffect(() => {
    if (typeof document === "undefined") {
      continueRender(fontHandle);
      setFontReady(true);
      return;
    }
    if (!document.getElementById("asap-medium-face")) {
      const style = document.createElement("style");
      style.id = "asap-medium-face";
      style.textContent = `
        @font-face {
          font-family: '${FONT_FAMILY}';
          src: url('${staticFile("assets/AsapCondensed-Medium.ttf")}') format('truetype');
          font-weight: 500;
          font-style: normal;
        }
        @font-face {
          font-family: '${FONT_FAMILY}';
          src: url('${staticFile("assets/AsapCondensed-Bold.ttf")}') format('truetype');
          font-weight: 700;
          font-style: normal;
        }
      `;
      document.head.appendChild(style);
    }
    document.fonts
      .load(`500 64px "${FONT_FAMILY}"`)
      .then(() => { setFontReady(true); continueRender(fontHandle); })
      .catch(() => { setFontReady(true); continueRender(fontHandle); });
  }, [fontHandle]);

  useEffect(() => {
    fetch(staticFile("captions.json"))
      .then((r) => r.json())
      .then((data: Caption[]) => { setCaptions(data); continueRender(captionHandle); })
      .catch(() => continueRender(captionHandle));
  }, [captionHandle]);

  return {fontReady, captions};
}

// ─── Single caption page ──────────────────────────────────────────────────────

const CaptionPage: React.FC<{page: Page}> = ({page}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentMs = (frame / fps) * 1000 + page.startMs;

  const displayWords = page.words.filter((w) => !SKIP_DISPLAY.test(w.text.trim()));

  return (
    <div style={{textAlign: "center", maxWidth: 960, padding: "0 20px", lineHeight: 1.25}}>
      {displayWords.map((w, i) => {
        const isActive = currentMs >= w.startMs && currentMs < w.endMs;
        return (
          <span
            key={i}
            style={{
              fontFamily: `'${FONT_FAMILY}', sans-serif`,
              fontWeight: 500,
              fontSize: 84,
              color: isActive ? "#FFE234" : "#ffffff",
              textShadow:
                "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
              letterSpacing: 0.5,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

// ─── Captions overlay (reusable) ──────────────────────────────────────────────

export const NutfruitCaptions: React.FC<{
  captions: Caption[];
  bottomPx?: number;
}> = ({captions, bottomPx = 140}) => {
  const {durationInFrames, fps} = useVideoConfig();
  const totalMs = (durationInFrames / fps) * 1000;

  const pages = useMemo<Page[]>(() => {
    const words = mergeSubTokens(captions);
    return buildSentencePages(words);
  }, [captions]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: bottomPx,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {pages.map((page, i) => {
        const startFrame = Math.round((page.startMs / 1000) * fps);
        const nextStartMs = pages[i + 1]?.startMs ?? totalMs;
        const endFrame = Math.round((nextStartMs / 1000) * fps);
        const duration = Math.max(1, endFrame - startFrame);

        return (
          <Sequence key={i} from={startFrame} durationInFrames={duration} layout="none">
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </div>
  );
};
