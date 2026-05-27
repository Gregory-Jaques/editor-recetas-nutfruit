import React from "react";
import {AbsoluteFill, Video, staticFile, Sequence} from "remotion";
import {useNutfruitAssets, useRecipeCaptions, NutfruitCaptions} from "./nutfruit-shared";

const FPS = 25;
const TOTAL_FRAMES = 47 * FPS; // 1175

// Texto overlay: aparece en 25s, dura su tiempo natural (3.46s)
const TEXTO_FROM     = 25 * FPS;              // 625
const TEXTO_DURATION = Math.round(3.46 * FPS); // 87 frames

// Intro/outro overlay (intro.mp4 = 5.06s @ 25fps)
const INTRO_FRAMES = Math.round(5.06 * FPS); // 127

export const ConductoraVertical: React.FC = () => {
  const {fontReady} = useNutfruitAssets();
  const {captions} = useRecipeCaptions("conductora-captions.json");

  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>

      {/* ── Main video ── */}
      <AbsoluteFill>
        <Video
          src={staticFile("assets/conductora.mp4")}
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

      {/* ── Texto overlay — aparece en 25s, dura su tiempo natural (3.46s) ── */}
      <Sequence from={TEXTO_FROM} durationInFrames={TEXTO_DURATION}>
        <AbsoluteFill>
          <Video
            src={staticFile("assets/texto-conductora.webm")}
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
