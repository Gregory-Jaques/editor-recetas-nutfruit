import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {ColorCtx, FONT_PH, FONT_PH_DISPLAY, usePHFonts} from "./shared";

export interface StepCardPHProps {
  stepNumber?:      number;
  stepDescription?: string;
  corner?:          "bottomRight" | "bottomLeft" | "topRight" | "topLeft";
  bottomOffset?:    number;
}

const DEFAULT: Required<StepCardPHProps> = {
  stepNumber:      1,
  stepDescription: "MAKE THE SALSA",
  corner:          "bottomRight",
  bottomOffset:    56,
};

const R  = 22;    // radio de las esquinas redondeadas
const EXIT = 106;

export const StepCardPH: React.FC<StepCardPHProps> = (raw) => {
  const props = {...DEFAULT, ...raw};
  const {stepNumber, stepDescription, corner, bottomOffset} = props;
  const frame   = useCurrentFrame();
  const {fps}   = useVideoConfig();
  const {ready} = usePHFonts();
  const colors  = React.useContext(ColorCtx);

  const isRight  = corner.includes("Right");
  const isBottom = corner.includes("bottom");

  // ── Fade de salida ─────────────────────────────────────────────────────────
  const fade = interpolate(frame, [EXIT, EXIT + 15], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── Slide de entrada desde la esquina ─────────────────────────────────────
  const slideProg = spring({
    fps, frame,
    config: {damping: 18, stiffness: 170},
    durationInFrames: 35,
  });
  const slideX = interpolate(slideProg, [0, 1], [isRight ? 480 : -480, 0]);

  // ── Badge aparece tras asentarse la tarjeta ────────────────────────────────
  const badgeOpa = interpolate(frame, [18, 28], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const lines = stepDescription.split("\n");

  // ── Forma: 3 esquinas redondeadas, 1 esquina recta ────────────────────────
  // La esquina recta apunta hacia la esquina de pantalla donde está posicionada.
  // CSS border-radius: top-left  top-right  bottom-right  bottom-left
  const badgeRadius = {
    bottomRight: `${R}px ${R}px 0    ${R}px`,   // esquina recta: bottom-right
    bottomLeft:  `${R}px ${R}px ${R}px 0   `,   // esquina recta: bottom-left
    topRight:    `${R}px 0    ${R}px ${R}px`,   // esquina recta: top-right
    topLeft:     `0    ${R}px ${R}px ${R}px`,   // esquina recta: top-left
  }[corner];

  // La descripción usa la misma lógica de esquina recta
  const descRadius = badgeRadius;

  if (!ready) return <AbsoluteFill style={{background: "transparent"}} />;

  return (
    <AbsoluteFill style={{background: "transparent"}}>
      <div style={{
        position:      "absolute",
        [isBottom ? "bottom" : "top"]: isBottom ? bottomOffset : 56,
        [isRight  ? "right"  : "left"]: 56,
        opacity:       fade,
        transform:     `translateX(${slideX}px)`,
        display:       "flex",
        flexDirection: "column",
        alignItems:    isRight ? "flex-end" : "flex-start",
        gap:           10,
      }}>

        {/* ── Badge "STEP X" — 3 esquinas round, 1 recta ── */}
        <div style={{
          opacity:       badgeOpa,
          background:    colors.accent,
          borderRadius:  badgeRadius,
          padding:       "10px 26px",
          display:       "inline-block",
          boxShadow:     "0 4px 18px rgba(0,0,0,0.30)",
          alignSelf:     isRight ? "flex-end" : "flex-start",
        }}>
          <span style={{
            fontFamily:    `'${FONT_PH}', sans-serif`,
            fontWeight:    700,
            fontSize:      22,
            color:         colors.white,
            letterSpacing: 3,
            textTransform: "uppercase" as const,
            lineHeight:    1,
          }}>
            STEP {stepNumber}
          </span>
        </div>

        {/* ── Descripción — misma forma, fondo color de marca ── */}
        <div style={{
          background:    colors.dark,
          borderRadius:  descRadius,
          padding:       "18px 28px 22px",
          alignSelf:     isRight ? "flex-end" : "flex-start",
          boxShadow:     "0 8px 32px rgba(0,0,0,0.50)",
        }}>
          {lines.map((line, i) => {
            const lineProg = spring({
              fps,
              frame: frame - (8 + i * 6),
              config: {damping: 22, stiffness: 260},
              durationInFrames: 28,
            });
            const ty = interpolate(lineProg, [0, 1], [105, 0]);
            return (
              <div key={i} style={{overflow: "hidden", height: 62, lineHeight: 1}}>
                <div style={{
                  transform:     `translateY(${ty}%)`,
                  fontFamily:    `'${FONT_PH_DISPLAY}', sans-serif`,
                  fontWeight:    900,
                  fontSize:      58,
                  color:         colors.white,
                  letterSpacing: -0.5,
                  lineHeight:    1.06,
                  textTransform: "uppercase" as const,
                  whiteSpace:    "nowrap",
                  textAlign:     isRight ? "right" : "left",
                }}>
                  {line}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </AbsoluteFill>
  );
};
