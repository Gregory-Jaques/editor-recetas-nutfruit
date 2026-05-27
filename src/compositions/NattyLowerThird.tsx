import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import {FONT_FAMILY} from "./nutfruit-shared";

interface Props {
  fromFrame: number;
  durationFrames: number;
  bottomPx?: number;
  scaleFactor?: number;
  offsetX?: number; // px, negative = shift left
  // Content overrides (defaults = Natty Nuez branding)
  namePart1?: string;
  namePart2?: string;
  subtitle?: string;
  avatarSrc?: string;
  subtitleFontSize?: number;
  nameFontSize?: number;
  name1Weight?: number;
  name2Weight?: number;
}

const RING_GREEN = "#C8DC2D";
const RING_DARK = "#0E0E0E";
const CARD_BLACK = "#0A0A0A";

const BADGE_SIZE = 340;
const CARD_W = 790;
const CARD_H = 185;
const CARD_OVERLAP = 50;
const TOTAL_W = BADGE_SIZE + CARD_W - CARD_OVERLAP;

export const NattyLowerThird: React.FC<Props> = ({
  fromFrame, durationFrames, bottomPx, scaleFactor = 1, offsetX = 0,
  namePart1 = "NATTY", namePart2 = "NUEZ",
  subtitle = "EMPANADAS DULCES DE NUEZ",
  avatarSrc = "assets/avatar-square.png",
  subtitleFontSize = 34,
  nameFontSize = 130,
  name1Weight = 500,
  name2Weight = 700,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = frame - fromFrame;

  if (local < -2 || local > durationFrames + 2) return null;

  // Badge entrance: slingshot from left
  const badgeIn = spring({
    fps,
    frame: local,
    config: {damping: 12, stiffness: 110, mass: 0.7},
    durationInFrames: 18,
  });
  const badgeX = interpolate(badgeIn, [0, 1], [-450, 0]);
  const badgeRotate = interpolate(badgeIn, [0, 1], [-30, 0]);

  // Card reveal: scales horizontally from 0 to 1, originating from left edge
  const cardDelay = 4;
  const cardIn = spring({
    fps,
    frame: local - cardDelay,
    config: {damping: 14, stiffness: 140, mass: 0.7},
    durationInFrames: 16,
  });
  const cardScaleX = interpolate(cardIn, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit: white flash + scale out
  const exitStart = durationFrames - 10;
  const exitProg = interpolate(local, [exitStart, durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flashOpacity = interpolate(exitProg, [0, 0.4, 1], [0, 1, 0]);
  const groupScale = interpolate(exitProg, [0, 1], [1, 1.25]);
  const groupOpacity = interpolate(exitProg, [0, 0.5, 1], [1, 1, 0]);

  const positionStyle: React.CSSProperties =
    bottomPx !== undefined
      ? {
          position: "absolute",
          bottom: bottomPx,
          left: "50%",
          transform: `translateX(calc(-50% + ${offsetX}px)) scale(${groupScale * scaleFactor})`,
          transformOrigin: "center bottom",
        }
      : {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translateX(calc(-50% + ${offsetX}px)) translateY(-50%) scale(${groupScale * scaleFactor})`,
          transformOrigin: "center",
        };

  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <div
        style={{
          ...positionStyle,
          width: TOTAL_W,
          height: BADGE_SIZE,
          opacity: groupOpacity,
          filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.45))",
        }}
      >
        {/* Card — sits behind badge, grows out to the right */}
        <div
          style={{
            position: "absolute",
            left: BADGE_SIZE - CARD_OVERLAP,
            top: (BADGE_SIZE - CARD_H) / 2,
            width: CARD_W,
            height: CARD_H,
            transform: `scaleX(${cardScaleX})`,
            transformOrigin: "left center",
            zIndex: 1,
          }}
        >
          <NameCard namePart1={namePart1} namePart2={namePart2} subtitle={subtitle} subtitleFontSize={subtitleFontSize} nameFontSize={nameFontSize} name1Weight={name1Weight} name2Weight={name2Weight} />
        </div>

        {/* Badge — front layer */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 2,
            transform: `translateX(${badgeX}px) rotate(${badgeRotate}deg)`,
            transformOrigin: "center",
          }}
        >
          <BadgeCircle avatarSrc={avatarSrc} />
        </div>
      </div>

      {/* White flash on exit */}
      {flashOpacity > 0 && (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at 35% 50%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 25%, rgba(255,255,255,0) 60%)",
            opacity: flashOpacity,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

const BadgeCircle: React.FC<{avatarSrc: string}> = ({avatarSrc}) => {
  const size = BADGE_SIZE;
  const ring = 16;

  return (
    <div style={{position: "relative", width: size, height: size}}>
      {/* Lime green ring */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: RING_GREEN,
        }}
      />
      {/* Avatar portrait clipped to circle */}
      <div
        style={{
          position: "absolute",
          inset: ring,
          borderRadius: "50%",
          overflow: "hidden",
          backgroundImage: `url(${staticFile(avatarSrc)})`,
          backgroundSize: "135%",
          backgroundPosition: "center 38%",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#1a3a4a",
        }}
      />
    </div>
  );
};

const NameCard: React.FC<{
  namePart1: string;
  namePart2: string;
  subtitle: string;
  subtitleFontSize: number;
  nameFontSize: number;
  name1Weight: number;
  name2Weight: number;
}> = ({namePart1, namePart2, subtitle, subtitleFontSize, nameFontSize, name1Weight, name2Weight}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: `2px solid ${RING_DARK}`,
        background: "white",
        overflow: "hidden",
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
      }}
    >
      {/* White portion: name */}
      <div
        style={{
          flex: 1,
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: CARD_OVERLAP + 8,
          paddingRight: 8,
          fontFamily: `'${FONT_FAMILY}', sans-serif`,
          fontSize: nameFontSize,
          color: CARD_BLACK,
          lineHeight: 1,
          letterSpacing: 0.5,
        }}
      >
        <span style={{fontWeight: name1Weight}}>{namePart1}</span>
        {namePart2 ? <span style={{fontWeight: name2Weight, marginLeft: 12}}>{namePart2}</span> : null}
      </div>

      {/* Black bar: subtitle */}
      <div
        style={{
          background: CARD_BLACK,
          paddingTop: 3,
          paddingBottom: 3,
          paddingLeft: CARD_OVERLAP + 8,
          paddingRight: 8,
          fontFamily: `'${FONT_FAMILY}', sans-serif`,
          fontSize: subtitleFontSize,
          color: "white",
          letterSpacing: 1,
          fontWeight: 500,
          textAlign: "center",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};
