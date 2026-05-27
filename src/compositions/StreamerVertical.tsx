import React from "react";
import {AbsoluteFill, Video, staticFile, Sequence} from "remotion";
import {useNutfruitAssets, useRecipeCaptions, NutfruitCaptions} from "./nutfruit-shared";

const FPS = 25;
const TOTAL_FRAMES = 80 * FPS; // 2000

// Lower third: 5s–10s (frames 125–250)
const LT_FROM     = 5 * FPS;          // 125
const LT_DURATION = (10 - 5) * FPS;   // 125 frames (5s)

// Intro/outro overlay (intro.mp4 = 5.06s @ 25fps)
const INTRO_FRAMES = Math.round(5.06 * FPS); // 127

export const StreamerVertical: React.FC = () => {
  const {fontReady} = useNutfruitAssets();
  const {captions} = useRecipeCaptions("streamer-captions.json");

  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>

      {/* ── Main video ── */}
      <AbsoluteFill>
        <Video
          src={staticFile("assets/streamer.mp4")}
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

      {/* ── Lower third — frame 125–250 (5s–10s) ── */}
      <Sequence from={LT_FROM} durationInFrames={LT_DURATION}>
        <AbsoluteFill>
          <Video
            src={staticFile("assets/lowerthird-streamer1.webm")}
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

      {/* ── Outro overlay (end) ── */}
      <Sequence from={TOTAL_FRAMES - INTRO_FRAMES} durationInFrames={INTRO_FRAMES}>
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
