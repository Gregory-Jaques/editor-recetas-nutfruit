import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {ColorCtx, usePHFonts} from "./shared";

export interface OutroTextPHProps {
  line1?:    string;
  line2?:    string;
  hashtag?:  string;   // reservado, no usado
  cta?:      string;   // reservado, no usado
  position?: "top" | "center" | "bottom";
}

const DEFAULT: Required<OutroTextPHProps> = {
  line1:    "ENJOY",
  line2:    "YOUR MEAL!",
  hashtag:  "#NutfruitRecetas",
  cta:      "More healthy recipes every week on Nutfruit",
  position: "center",
};

// Timings
const T_ENJOY = 0;
const T_BADGE = 14;
const EXIT    = 125;

export const OutroTextPH: React.FC<OutroTextPHProps> = (raw) => {
  const props   = {...DEFAULT, ...raw};
  const {line1, line2, position} = props;
  const frame   = useCurrentFrame();
  const {fps}   = useVideoConfig();
  const {ready} = usePHFonts();
  const colors  = React.useContext(ColorCtx);

  // ── Fade salida ────────────────────────────────────────────────────────────
  const fade = interpolate(frame, [EXIT, EXIT + 20], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── "ENJOY" — palabras clipean hacia arriba ────────────────────────────────
  const enjoyWords = line1.split(" ");

  // ── "YOUR MEAL!" badge — cae desde arriba con rebote ──────────────────────
  const badgeProg = spring({fps, frame: frame - T_BADGE,
    config: {damping: 10, stiffness: 200}, durationInFrames: 30});
  const badgeY   = interpolate(badgeProg, [0, 1], [-180, 0]);
  const badgeOpa = interpolate(badgeProg, [0, 0.15, 1], [0, 1, 1]);

  const yMap: Record<string, string> = {top: "20%", center: "50%", bottom: "72%"};

  if (!ready) return <AbsoluteFill style={{background: "transparent"}} />;

  return (
    <AbsoluteFill style={{background: "transparent"}}>
      <div style={{
        position:      "absolute",
        top:           yMap[position],
        left:          "8%",
        transform:     "translateY(-50%)",
        display:       "flex",
        flexDirection: "column",
        alignItems:    "flex-start",
        opacity:       fade,
      }}>

        {/* "ENJOY" — Thumpa masivo, clip por palabra ─────────────────────── */}
        <div style={{display: "flex", flexWrap: "wrap", gap: 0, marginBottom: 10}}>
          {enjoyWords.map((word, i) => {
            const prog = spring({
              fps,
              frame: frame - (T_ENJOY + i * 5),
              config: {damping: 24, stiffness: 255},
              durationInFrames: 28,
            });
            const ty       = interpolate(prog, [0, 1], [105, 0]);
            const trailing = i < enjoyWords.length - 1 ? " " : "";
            return (
              <span
                key={i}
                style={{display: "inline-block", overflow: "hidden", height: 160, verticalAlign: "bottom"}}
              >
                <span style={{
                  display:                "block",
                  fontFamily:             `'Thumpa', sans-serif`,
                  fontWeight:             900,
                  fontSize:               155,
                  letterSpacing:          -2,
                  lineHeight:             1.032,
                  textTransform:          "uppercase" as const,
                  transform:              `translateY(${ty}%)`,
                  whiteSpace:             "pre",
                  background:             "linear-gradient(to right, #1a4ef5, #00c8ff)",
                  WebkitBackgroundClip:   "text",
                  WebkitTextFillColor:    "transparent",
                  backgroundClip:         "text",
                  color:                  "transparent",
                }}>
                  {word}{trailing}
                </span>
              </span>
            );
          })}
        </div>

        {/* "YOUR MEAL!" — badge cae desde arriba ──────────────────────────────
            Forma: pill completo (9999px) en 3 esquinas, 1 esquina recta (0)
            Esquina recta: bottom-right — misma lógica que StepCardPH          */}
        <div style={{
          transform: `translateY(${badgeY}px)`,
          opacity:   badgeOpa,
        }}>
          <div style={{
            background:   colors.accent,
            borderRadius: "9999px 9999px 0 9999px",
            padding:      "16px 56px 20px",
            display:      "inline-block",
            boxShadow:    "0 14px 50px rgba(0,0,0,0.40)",
          }}>
            <span style={{
              fontFamily:    `'Thumpa', sans-serif`,
              fontWeight:    900,
              fontSize:      118,
              color:         colors.white,
              letterSpacing: -1.5,
              lineHeight:    1,
              textTransform: "uppercase" as const,
              display:       "block",
              whiteSpace:    "nowrap",
            }}>
              {line2}
            </span>
          </div>
        </div>

      </div>
    </AbsoluteFill>
  );
};
