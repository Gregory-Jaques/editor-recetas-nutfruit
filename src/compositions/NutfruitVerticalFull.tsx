import React from "react";
import {AbsoluteFill, Video, staticFile, Sequence, useCurrentFrame, interpolate} from "remotion";
import {useNutfruitAssets, useRecipeCaptions, NutfruitCaptions} from "./nutfruit-shared";

// Lower third: entra en frame 295, termina frame 398
const LT_FROM      = 295;
const LT_DURATION  = 398 - 295; // 103 frames

// Cámara virtual — shift horizontal para seguir al personaje
const SHIFT_START     = 124;
const SHIFT_FADE      = 6;
const SHIFT_X_DEFAULT = 50;
const SHIFT_X_ACTIVE  = 22;
const LT_START        = 276;
const LT_END          = 398;
const SHIFT_X_LT      = 50;

interface Props {
  videoSrc?: string;
}

export const NutfruitVerticalFull: React.FC<Props> = ({videoSrc = "assets/nutfruit.mp4"}) => {
  const {fontReady} = useNutfruitAssets();
  const {captions} = useRecipeCaptions("receta1-captions.json");
  const frame = useCurrentFrame();

  const objectPosX = interpolate(
    frame,
    [
      SHIFT_START - SHIFT_FADE,
      SHIFT_START,
      LT_START - SHIFT_FADE,
      LT_START,
      LT_END,
      LT_END + SHIFT_FADE,
    ],
    [SHIFT_X_DEFAULT, SHIFT_X_ACTIVE, SHIFT_X_ACTIVE, SHIFT_X_LT, SHIFT_X_LT, SHIFT_X_DEFAULT],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>

      {/* ── Main video ── */}
      <AbsoluteFill>
        <Video
          src={staticFile(videoSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${objectPosX}% center`,
          }}
        />
      </AbsoluteFill>

      {/* ── Bottom gradient ── */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 30%, transparent 60%)",
        }}
      />

      {/* ── Lower third — entra frame 295, dura 7s ── */}
      <Sequence from={LT_FROM} durationInFrames={LT_DURATION}>
        <AbsoluteFill>
          <Video
            src={staticFile("assets/lowerthird-receta1.webm")}
            volume={0}
            style={{width: "100%", height: "100%"}}
          />
        </AbsoluteFill>
      </Sequence>

      {/* ── Subtítulos ── */}
      {fontReady && captions && (
        <NutfruitCaptions captions={captions} bottomPx={140} />
      )}

    </AbsoluteFill>
  );
};
