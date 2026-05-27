import React from "react";
import {AbsoluteFill, Video, staticFile} from "remotion";
import {useNutfruitAssets, NutfruitCaptions} from "./nutfruit-shared";

// Letterboxed: video 1920×1080 centrado en canvas 1080×1920 con fondo borroso
export const NutfruitVertical: React.FC = () => {
  const {fontReady, captions} = useNutfruitAssets();

  const videoH = Math.round(1080 * (1080 / 1920)); // 608px

  return (
    <AbsoluteFill style={{backgroundColor: "#000", overflow: "hidden"}}>
      {/* Fondo borroso */}
      <AbsoluteFill>
        <Video
          src={staticFile("assets/nutfruit.mp4")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(24px) brightness(0.4) saturate(1.4)",
            transform: "scale(1.1)",
          }}
        />
      </AbsoluteFill>

      {/* Video letterboxed centrado verticalmente */}
      <AbsoluteFill style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
        <div
          style={{
            width: 1080,
            height: videoH,
            overflow: "hidden",
            borderRadius: 10,
            boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
          }}
        >
          <Video
            src={staticFile("assets/nutfruit.mp4")}
            style={{width: "100%", height: "100%", objectFit: "cover"}}
          />
        </div>
      </AbsoluteFill>

      {/* Subtítulos en la parte inferior */}
      {fontReady && captions && (
        <NutfruitCaptions captions={captions} bottomPx={140} />
      )}
    </AbsoluteFill>
  );
};
