import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {C, FONT, useNRFonts} from "./shared";

export interface RecipeIntroProps {
  line1?:    string;
  line2?:    string;
  position?: "top" | "center" | "bottom";
}

const DEFAULT: Required<RecipeIntroProps> = {
  line1:    "VINAGRETA DE AVELLANAS",
  line2:    "Y CIRUELAS PASAS",
  position: "top",
};

// Each word clips up through its own slot — container clips the overflow
function TextReveal({
  text,
  startFrame,
  wordStagger,
  fontSize,
  color,
  frame,
  fps,
  shadow,
}: {
  text: string;
  startFrame: number;
  wordStagger: number;
  fontSize: number;
  color: string;
  frame: number;
  fps: number;
  shadow?: string;
}) {
  const words = text.split(" ");
  return (
    // gap: 0 — el espacio entre palabras lo da el   dentro de cada contenedor,
    // igual que el espacio natural del CSS que usa line2
    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 0}}>
      {words.map((word, i) => {
        const prog = spring({
          fps,
          frame: frame - (startFrame + i * wordStagger),
          config: {damping: 26, stiffness: 300},
          durationInFrames: 20,
        });
        const ty = interpolate(prog, [0, 1], [105, 0]);
        // El espacio NO-SEPARABLE al final de cada palabra (excepto la última)
        // usa el mismo ancho que un espacio normal del font — idéntico a line2
        const trailingSpace = i < words.length - 1 ? " " : "";
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              height: fontSize * 1.08,
              verticalAlign: "bottom",
            }}
          >
            <span
              style={{
                display: "block",
                fontFamily: `'${FONT}', sans-serif`,
                fontWeight: 900,
                fontSize,
                color,
                letterSpacing: 2,
                lineHeight: 1.08,
                textTransform: "uppercase" as const,
                transform: `translateY(${ty}%)`,
                textShadow: shadow,
                whiteSpace: "pre",
              }}
            >
              {word}{trailingSpace}
            </span>
          </span>
        );
      })}
    </div>
  );
}

export const RecipeIntro: React.FC<RecipeIntroProps> = (raw) => {
  const props = {...DEFAULT, ...raw};
  const {line1, line2, position} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {ready} = useNRFonts();

  // exit
  const EXIT = 105;
  const fade = interpolate(frame, [EXIT, EXIT + 15], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // red bar: extends left-to-right before text
  const barProg = spring({fps, frame, config: {damping: 30, stiffness: 380}});
  const barScaleX = interpolate(barProg, [0, 1], [0, 1]);

  // pill background expands
  const pillProg = spring({fps, frame: frame - 14, config: {damping: 24, stiffness: 320}});
  const pillScaleX = interpolate(pillProg, [0, 1], [0.02, 1]);
  // pill text reveals after pill is wide enough
  const pillTextOpa = interpolate(
    frame, [22, 30], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  const yMap: Record<string, string> = {top: "18%", center: "50%", bottom: "74%"};

  const shadow = "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000";

  if (!ready) return <AbsoluteFill style={{background: "transparent"}} />;

  return (
    <AbsoluteFill style={{background: "transparent"}}>
      <div
        style={{
          position: "absolute",
          top: yMap[position],
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          opacity: fade,
        }}
      >
        {/* thin red rule */}
        <div style={{
          width: 540,
          height: 4,
          background: C.red,
          transformOrigin: "left center",
          transform: `scaleX(${barScaleX})`,
          marginBottom: 8,
        }} />

        {/* line 1 — white text clip-reveal per word */}
        <TextReveal
          text={line1}
          startFrame={4}
          wordStagger={3}
          fontSize={96}
          color={C.white}
          frame={frame}
          fps={fps}
          shadow={shadow}
        />

        {/* line 2 — red pill grows then text appears */}
        <div style={{
          position: "relative",
          transform: `scaleX(${pillScaleX})`,
          transformOrigin: "center",
          background: C.red,
          borderRadius: 12,
          padding: "12px 48px",
          marginTop: 4,
          boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
        }}>
          <span style={{
            display: "block",
            opacity: pillTextOpa,
            fontFamily: `'${FONT}', sans-serif`,
            fontWeight: 900,
            fontSize: 96,
            color: C.white,
            letterSpacing: 2,
            lineHeight: 1,
            textTransform: "uppercase" as const,
            whiteSpace: "nowrap",
          }}>
            {line2}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
