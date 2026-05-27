import React from "react";
import {AbsoluteFill, Video, staticFile, Sequence} from "remotion";
import {useNutfruitAssets, useRecipeCaptions, NutfruitCaptions} from "./nutfruit-shared";

const FPS = 25;

// Lower third: 7s × 25fps = 175 frames
const LT_FROM     = 197;
const LT_DURATION = 7 * FPS; // 175 frames

// Intro/outro overlay (intro.mp4 = 5.06s @ 25fps)
const INTRO_FRAMES = Math.round(5.06 * FPS); // 127
const OUTRO_FROM   = 1429; // frame exacto donde empieza el outro

export const AvellanasVertical: React.FC = () => {
  const {fontReady} = useNutfruitAssets();
  const {captions} = useRecipeCaptions("receta4-captions.json");

  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>

      {/* ── Main video ── */}
      <AbsoluteFill>
        <Video
          src={staticFile("assets/receta4.mp4")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% center",
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

      {/* ── Lower third — frame 197, dura 7s ── */}
      <Sequence from={LT_FROM} durationInFrames={LT_DURATION}>
        <AbsoluteFill>
          <Video
            src={staticFile("assets/lowerthird-receta4.webm")}
            volume={0}
            style={{width: "100%", height: "100%"}}
          />
        </AbsoluteFill>
      </Sequence>

      {/* ── Subtítulos ── */}
      {fontReady && captions && (
        <NutfruitCaptions captions={captions} bottomPx={140} />
      )}

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

      {/* ── Outro overlay — empieza frame 1429 ── */}
      <Sequence from={OUTRO_FROM} durationInFrames={INTRO_FRAMES}>
        <AbsoluteFill>
          <Video
            src={staticFile("assets/intro.mp4")}
            volume={0}
            style={{width: "100%", height: "100%", objectFit: "cover"}}
          />
        </AbsoluteFill>
      </Sequence>

    </AbsoluteFill>
  );
};
