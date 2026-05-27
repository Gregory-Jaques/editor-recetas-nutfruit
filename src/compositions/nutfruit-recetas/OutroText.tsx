import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {C, FONT, useNRFonts, WavyLine} from "./shared";

export interface OutroTextProps {
  line1?:    string;
  line2?:    string;
  hashtag?:  string;
  cta?:      string;
  position?: "top" | "center" | "bottom";
}

const DEFAULT: Required<OutroTextProps> = {
  line1:    "¡BUEN",
  line2:    "PROVECHO!",
  hashtag:  "#NutfruitRecetas",
  cta:      "Síguenos para más recetas saludables",
  position: "center",
};

const FS = 172; // main font size

export const OutroText: React.FC<OutroTextProps> = (raw) => {
  const props = {...DEFAULT, ...raw};
  const {line1, line2, hashtag, cta, position} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {ready} = useNRFonts();

  const EXIT = 125;
  const fade = interpolate(frame, [EXIT, EXIT + 20], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const sp = (delay: number, d: number, s: number) =>
    spring({fps, frame: frame - delay, config: {damping: d, stiffness: s}, durationInFrames: 35});

  // line1: clips up fast
  const l1Prog = sp(0, 26, 320);
  const l1TY   = interpolate(l1Prog, [0, 1], [105, 0]);

  // pill: drops from above with a decisive bounce
  const pillProg = sp(10, 8, 200);
  const pillY    = interpolate(pillProg, [0, 1], [-FS * 1.2, 0]);

  // wavy line draws on
  const waveProg = sp(22, 28, 280);
  const waveDraw = interpolate(waveProg, [0, 1], [0, 1]);

  // hashtag: clips up
  const hashProg = sp(30, 26, 300);
  const hashTY   = interpolate(hashProg, [0, 1], [105, 0]);

  // cta fades
  const ctaOpa = interpolate(frame, [40, 52], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const shadow = "2px 2px 0 rgba(0,0,0,0.9), -1px -1px 0 rgba(0,0,0,0.9), 1px -1px 0 rgba(0,0,0,0.9), -1px 1px 0 rgba(0,0,0,0.9)";

  const yMap: Record<string, string> = {top: "22%", center: "50%", bottom: "72%"};

  if (!ready) return <AbsoluteFill style={{background: "transparent"}} />;

  return (
    <AbsoluteFill style={{background: "transparent"}}>
      <div
        style={{
          position: "absolute",
          top: yMap[position],
          left: "8%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          opacity: fade,
        }}
      >
        {/* line 1: clip reveal */}
        <div style={{overflow: "hidden", height: FS * 1.0, lineHeight: 1}}>
          <div
            style={{
              transform: `translateY(${l1TY}%)`,
              fontFamily: `'${FONT}', sans-serif`,
              fontWeight: 900,
              fontSize: FS,
              color: C.white,
              letterSpacing: -1,
              textTransform: "uppercase" as const,
              lineHeight: 1,
              textShadow: shadow,
            }}
          >
            {line1}
          </div>
        </div>

        {/* line 2: pill drops from above */}
        <div
          style={{
            transform: `translateY(${pillY}px)`,
            background: C.red,
            borderRadius: 14,
            padding: "6px 52px 10px",
            marginTop: -4,
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          }}
        >
          <span
            style={{
              fontFamily: `'${FONT}', sans-serif`,
              fontWeight: 900,
              fontSize: FS,
              color: C.white,
              letterSpacing: -1,
              textTransform: "uppercase" as const,
              lineHeight: 1,
              display: "block",
            }}
          >
            {line2}
          </span>
        </div>

        {/* wavy line */}
        <div style={{marginTop: 20, marginBottom: 14, alignSelf: "flex-start"}}>
          <WavyLine color={C.white} width={500} strokeWidth={4} drawProgress={waveDraw} />
        </div>

        {/* hashtag: clip reveal */}
        <div style={{overflow: "hidden", height: 54}}>
          <div
            style={{
              transform: `translateY(${hashTY}%)`,
              fontFamily: `'${FONT}', sans-serif`,
              fontWeight: 800,
              fontSize: 50,
              color: C.white,
              letterSpacing: 1,
              textShadow: shadow,
            }}
          >
            {hashtag}
          </div>
        </div>

        {/* cta */}
        <div
          style={{
            opacity: ctaOpa,
            fontFamily: `'${FONT}', sans-serif`,
            fontWeight: 400,
            fontSize: 32,
            color: "rgba(255,255,255,0.85)",
            marginTop: 6,
            textShadow: "0 1px 8px rgba(0,0,0,0.9)",
          }}
        >
          {cta}
        </div>
      </div>
    </AbsoluteFill>
  );
};
