import React from "react";
import {AbsoluteFill, Video, staticFile, Sequence, useCurrentFrame} from "remotion";
import {useNutfruitAssets, useRecipeCaptions, NutfruitCaptions} from "./nutfruit-shared";

const FPS = 24;

// Lower thirds: 7s × 24fps = 168 frames cada uno
const LT1_FROM      = 278;
const LT1_DURATION  = 342 - 278; // 64 frames (termina frame 342)
const LT2_FROM      = 1146;
const LT2_DURATION  = 7 * FPS;   // 168 frames (7s)

// Intro/outro overlay (intro.mp4 = 5.06s @ 24fps)
const INTRO_FRAMES  = Math.round(5.06 * FPS); // 121
const OUTRO_FROM    = 1272; // frame exacto donde empieza el outro

// ── Cámara virtual ───────────────────────────────────────────────────────────
const CAM_SHIFT_START = 276;
const CAM_SHIFT_END   = 342;
const CAM_X_DEFAULT   = 50;
const CAM_X_ACTIVE    = 10;

export const PecanaBonitoVertical: React.FC = () => {
  const {fontReady} = useNutfruitAssets();
  const {captions} = useRecipeCaptions("receta2-captions.json");
  const frame = useCurrentFrame();

  const objectPosX =
    frame >= CAM_SHIFT_START && frame <= CAM_SHIFT_END
      ? CAM_X_ACTIVE
      : CAM_X_DEFAULT;

  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>

      {/* ── Main video ── */}
      <AbsoluteFill>
        <Video
          src={staticFile("assets/receta2.mp4")}
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

      {/* ── Lower third 1 — frame 278–342 ── */}
      <Sequence from={LT1_FROM} durationInFrames={LT1_DURATION}>
        <AbsoluteFill>
          <Video
            src={staticFile("assets/lowerthird-receta2.webm")}
            volume={0}
            style={{width: "100%", height: "100%"}}
          />
        </AbsoluteFill>
      </Sequence>

      {/* ── Lower third 2 — frame 1146, dura 7s ── */}
      <Sequence from={LT2_FROM} durationInFrames={LT2_DURATION}>
        <AbsoluteFill>
          <Video
            src={staticFile("assets/lowerthird-receta2.webm")}
            volume={0}
            style={{width: "100%", height: "100%"}}
          />
        </AbsoluteFill>
      </Sequence>

      {/* ── Intro overlay (start) ── */}
      <Sequence from={0} durationInFrames={INTRO_FRAMES}>
        <AbsoluteFill>
          <Video
            src={staticFile("assets/intro.mp4")}
            volume={0}
            style={{width: "100%", height: "100%", objectFit: "cover"}}
          />
        </AbsoluteFill>
      </Sequence>

      {/* ── Outro overlay — empieza frame 1272 ── */}
      <Sequence from={OUTRO_FROM} durationInFrames={INTRO_FRAMES}>
        <AbsoluteFill>
          <Video
            src={staticFile("assets/intro.mp4")}
            volume={0}
            style={{width: "100%", height: "100%", objectFit: "cover"}}
          />
        </AbsoluteFill>
      </Sequence>

      {/* ── Subtítulos — encima de todo ── */}
      {fontReady && captions && (
        <NutfruitCaptions captions={captions} bottomPx={140} />
      )}

    </AbsoluteFill>
  );
};
