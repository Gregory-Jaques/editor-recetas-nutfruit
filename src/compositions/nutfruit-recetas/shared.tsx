import React, {useEffect, useState} from "react";
import {staticFile, delayRender, continueRender} from "remotion";

// ─── Brand colors ─────────────────────────────────────────────────────────────
export const C = {
  red:        "#d10f2a",
  green:      "#296239",
  greenDark:  "#265531",
  white:      "#ffffff",
} as const;

// ─── Font family ──────────────────────────────────────────────────────────────
export const FONT = "AsapCondensedNR";

// ─── Font loader hook ─────────────────────────────────────────────────────────
export function useNRFonts() {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("Loading NutfruitRecetas fonts"));

  useEffect(() => {
    if (typeof document === "undefined") {
      continueRender(handle);
      setReady(true);
      return;
    }
    if (!document.getElementById("nr-font-face")) {
      const weights: [string, number][] = [
        ["AsapCondensed-Regular",    400],
        ["AsapCondensed-Medium",     500],
        ["AsapCondensed-SemiBold",   600],
        ["AsapCondensed-Bold",       700],
        ["AsapCondensed-ExtraBold",  800],
        ["AsapCondensed-Black",      900],
      ];
      const style = document.createElement("style");
      style.id = "nr-font-face";
      style.textContent = weights
        .map(([file, w]) => `
          @font-face {
            font-family: '${FONT}';
            src: url('${staticFile(`assets/nutfruit-recetas/${file}.ttf`)}') format('truetype');
            font-weight: ${w};
            font-style: normal;
          }
        `)
        .join("");
      document.head.appendChild(style);
    }
    document.fonts
      .load(`900 72px "${FONT}"`)
      .then(() => { setReady(true); continueRender(handle); })
      .catch(() => { setReady(true); continueRender(handle); });
  }, [handle]);

  return {ready};
}

// ─── Brand asterisk icon (oficial Nutfruit Recetas) ──────────────────────────
export const NRIcon: React.FC<{size?: number; color?: string}> = ({
  size = 60,
  color = C.red,
}) => (
  <svg width={size} height={size} viewBox="0 0 79.07 78.95" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill={color}
      d="M33.83,26.26c0-8.46.27-15.26-.09-22.02C33.49-.65,36.48.05,39.44.03c3.04-.02,5.88-.53,5.59,4.32-.41,6.74-.1,13.52-.1,21.65,5.14-5.06,9.69-9.25,13.87-13.78,2.87-3.11,4.54-4.8,8.72-.77,4.59,4.42,1.67,6.16-1.07,8.85-4.22,4.14-8.36,8.36-13.75,13.76,7.96,0,14.57.29,21.13-.1,4.45-.27,5.29,1.49,5.24,5.46-.05,3.79-.51,5.86-5.12,5.57-6.49-.41-13.03-.1-21.17-.1,5.74,5.77,10.33,10.84,15.43,15.34,3.5,3.1,1.82,4.77-.71,6.89-2.21,1.85-3.63,5.46-7.25,1.18-4.37-5.16-9.43-9.74-15.32-15.72,0,8.11-.36,14.96.12,21.75.37,5.31-2.82,4.42-5.98,4.6-3.46.2-5.59-.18-5.33-4.64.4-6.7.1-13.44.1-22.06-5.92,6.18-10.9,10.97-15.39,16.19-3.35,3.9-4.89.89-6.82-1.16-1.84-1.96-5.08-3.41-1.12-6.79,5.23-4.47,9.96-9.53,16.2-15.59-8.28,0-14.56-.23-20.81.08C1.78,45.14-.09,44.41,0,39.59c.08-4.38,1.06-5.93,5.62-5.64,6.28.41,12.61.1,20.41.1-5.65-5.75-10.13-10.98-15.32-15.37-4.34-3.67-.82-5.1,1.11-7.28,2.06-2.33,3.72-4.37,6.84-.74,4.38,5.1,9.36,9.68,15.17,15.59Z"
    />
  </svg>
);

// ─── Wavy line decorator (supports draw-on via drawProgress 0→1) ─────────────
export const WavyLine: React.FC<{
  color?: string;
  width?: number;
  strokeWidth?: number;
  drawProgress?: number;   // 0 = hidden, 1 = fully drawn
}> = ({
  color = C.red,
  width = 160,
  strokeWidth = 4,
  drawProgress = 1,
}) => {
  const h = 22;
  const w = width;
  const seg = w / 3;
  const d = `M0,${h / 2} Q${seg * 0.5},2 ${seg},${h / 2} Q${seg * 1.5},${h - 2} ${seg * 2},${h / 2} Q${seg * 2.5},2 ${seg * 3},${h / 2}`;
  // pathLength="1" normalises path length so dashoffset 0→1 maps to 0→full
  const clampedProgress = Math.max(0, Math.min(1, drawProgress));
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - clampedProgress}
      />
    </svg>
  );
};

// ─── Pill badge ───────────────────────────────────────────────────────────────
export const Pill: React.FC<{
  text: string;
  bg?: string;
  textColor?: string;
  fontSize?: number;
  px?: number;
  py?: number;
}> = ({text, bg = C.red, textColor = C.white, fontSize = 28, px = 32, py = 10}) => (
  <div
    style={{
      display: "inline-block",
      background: bg,
      borderRadius: 999,
      padding: `${py}px ${px}px`,
      fontFamily: `'${FONT}', sans-serif`,
      fontWeight: 900,
      fontSize,
      color: textColor,
      letterSpacing: 2,
      textTransform: "uppercase" as const,
      lineHeight: 1,
    }}
  >
    {text}
  </div>
);
