import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {C, FONT, useNRFonts} from "./shared";

export interface StepCardProps {
  stepNumber?:      number;
  stepDescription?: string;
  corner?:          "bottomRight" | "bottomLeft" | "topRight" | "topLeft";
}

const DEFAULT: Required<StepCardProps> = {
  stepNumber:      1,
  stepDescription: "PROCESA TODOS\nLOS INGREDIENTES",
  corner:          "bottomRight",
};

export const StepCard: React.FC<StepCardProps> = (raw) => {
  const props = {...DEFAULT, ...raw};
  const {stepNumber, stepDescription, corner} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {ready} = useNRFonts();

  const isRight  = corner.includes("Right");
  const isBottom = corner.includes("bottom");

  const EXIT = 106;
  const fade = interpolate(frame, [EXIT, EXIT + 15], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // entire card slides in from the edge as one unit
  const slideProg = spring({
    fps, frame,
    config: {damping: 14, stiffness: 180},
    durationInFrames: 35,
  });
  const slideX = interpolate(slideProg, [0, 1], [isRight ? 340 : -340, 0]);

  // badge pops in after card settles
  const badgeProg = spring({
    fps, frame: frame - 16,
    config: {damping: 11, stiffness: 220},
    durationInFrames: 25,
  });
  const badgeScale = interpolate(badgeProg, [0, 1], [0.4, 1]);
  const badgeOpa   = interpolate(badgeProg, [0, 1], [0, 1]);

  if (!ready) return <AbsoluteFill style={{background: "transparent"}} />;

  const lines = stepDescription.split("\n");

  return (
    <AbsoluteFill style={{background: "transparent"}}>
      <div
        style={{
          position: "absolute",
          [isBottom ? "bottom" : "top"]: 56,
          [isRight  ? "right"  : "left"]: 56,
          opacity: fade,
          transform: `translateX(${slideX}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: isRight ? "flex-end" : "flex-start",
          gap: 0,
        }}
      >
        {/* badge */}
        <div style={{
          opacity: badgeOpa,
          transform: `scale(${badgeScale})`,
          transformOrigin: isRight ? "right bottom" : "left bottom",
          background: C.red,
          borderRadius: 8,
          padding: "7px 28px",
          marginBottom: -2,
          zIndex: 2,
          position: "relative",
          alignSelf: isRight ? "flex-end" : "flex-start",
          marginRight: isRight ? 16 : 0,
          marginLeft:  isRight ? 0  : 16,
        }}>
          <span style={{
            fontFamily: `'${FONT}', sans-serif`,
            fontWeight: 900,
            fontSize: 36,
            color: C.white,
            letterSpacing: 3,
            textTransform: "uppercase" as const,
            lineHeight: 1,
          }}>
            PASO {stepNumber}
          </span>
        </div>

        {/* card body */}
        <div style={{
          background: C.greenDark,
          borderRadius: 12,
          padding: "18px 28px 22px",
          boxShadow: "0 10px 36px rgba(0,0,0,0.6)",
          borderTop: `3px solid ${C.red}`,
          minWidth: 300,
          maxWidth: 420,
        }}>
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                fontFamily: `'${FONT}', sans-serif`,
                fontWeight: 900,
                fontSize: 52,
                color: C.white,
                letterSpacing: 1,
                textTransform: "uppercase" as const,
                lineHeight: 1.1,
                textAlign: isRight ? "right" : "left",
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
