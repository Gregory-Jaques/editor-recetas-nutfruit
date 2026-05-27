import React from "react";
import {AbsoluteFill, Video, Audio, staticFile, Sequence, interpolate} from "remotion";
import {RecipeIntro} from "./nutfruit-recetas/RecipeIntro";
import {RecipeIngredientsScreen} from "./nutfruit-recetas/RecipeIngredientsScreen";
import {StepCard} from "./nutfruit-recetas/StepCard";
import {OutroText} from "./nutfruit-recetas/OutroText";

// ── Timing constants (25 fps) ─────────────────────────────────────────────────
//  intro.mp3          →  5.07s = 127 frames
//  ingredientes.mp3   →  2.04s =  51 frames
//  paso1.mp3          → 10.27s = 257 frames
//  paso2.mp3          →  4.28s = 107 frames
//  paso3.mp3          →  4.75s = 119 frames
//  paso4.mp3          →  8.44s = 211 frames
//  paso5.mp3          →  8.36s = 209 frames
//  paso6.mp3          →  8.05s = 201 frames  ← empieza cuando termina paso5
//  final.mp3          →  4.21s = 105 frames  ← empieza cuando termina paso6
//  musica video 4.mp3 → 60.03s = 1501 frames
//  whoosh-in/out.mp3  →  1.56s =   39 frames
//  tresleches_16x9.mp4→   63s  = 1575 frames @ 25fps

const VIDEO_SRC  = staticFile("assets/nutfruit-recetas/receta4yt/tresleches_16x9.mp4");
const WHOOSH_IN  = staticFile("assets/nutfruit-recetas/receta4yt/whoosh-in.mp3");
const WHOOSH_OUT = staticFile("assets/nutfruit-recetas/receta4yt/whoosh-out.mp3");
const MUSIC_BG   = staticFile("assets/nutfruit-recetas/receta4yt/musica video 4.mp3");
const INTRO_SRC  = staticFile("assets/nutfruit-recetas/receta4yt/intro.mp3");
const INGR_VOICE = staticFile("assets/nutfruit-recetas/receta4yt/ingredientes.mp3");
const P1_SRC     = staticFile("assets/nutfruit-recetas/receta4yt/paso1.mp3");
const P2_SRC     = staticFile("assets/nutfruit-recetas/receta4yt/paso2.mp3");
const P3_SRC     = staticFile("assets/nutfruit-recetas/receta4yt/paso3.mp3");
const P4_SRC     = staticFile("assets/nutfruit-recetas/receta4yt/paso4.mp3");
const P5_SRC     = staticFile("assets/nutfruit-recetas/receta4yt/paso5.mp3");
const P6_SRC     = staticFile("assets/nutfruit-recetas/receta4yt/paso6.mp3");
const FINAL_SRC  = staticFile("assets/nutfruit-recetas/receta4yt/final.mp3");

// Volúmenes
const VOL_VIDEO  = 0.15;
const VOL_MUSIC  = 0.10;
const VOL_WHOOSH = 0.30;

// ── Sections ────────────────────────────────────────────────────────────────
const CUT_FRAME     = 100;
const INGR_DUR      = 160;
const INGR_FROM     = CUT_FRAME;               // 100
const INGR_FADE_OUT = 135;
const VIDEO_RESUME  = INGR_FROM + INGR_FADE_OUT; // 235

// ── Audio de pasos — secuencial, sin superposiciones ─────────────────────────
const P1_FROM = 260;                        // empieza cuando entra el paso 1
const P1_DUR  = 257;
const P2_FROM = 594;                        // empieza 1s antes del paso 2 visual
const P2_DUR  = 107;
const P3_FROM = 698;                        // empieza 1s antes del paso 3 visual
const P3_DUR  = 119;
const P4_FROM = 820;                        // justo después de paso3 (termina en 817)
const P4_DUR  = 78;
const P5_FROM = P4_FROM + P4_DUR;           // 898 — empieza cuando TERMINA paso4
const P5_DUR  = 209;
const P6_FROM = P5_FROM + P5_DUR + 25;      // 1132 — 1s después de que termina paso5
const P6_DUR  = 328;
const FINAL_FROM = P6_FROM + P6_DUR;        // 1308 — empieza cuando TERMINA paso6
const FINAL_DUR  = 238;

// ── Outro: entra cuando termina el audio de todos los pasos ──────────────────
const OUTRO_FROM = FINAL_FROM;              // 1308
const OUTRO_DUR  = 160;

const VIDEO_TOTAL = 1575;
const V2_DUR      = VIDEO_TOTAL - CUT_FRAME; // 1475
const V2_FADE_AT  = V2_DUR - 50;             // 1425
const MUSIC_DUR   = 1501;
// TOTAL_DUR = 1710 frames (Root.tsx)

// ── StepCards ────────────────────────────────────────────────────────────────
const S1_FROM = P1_FROM;            // 260
const S1_DUR  = 359;                // → 619
const S2_FROM = 619;                // ← fijado
const S2_DUR  = 104;                // → 723
const S3_FROM = S2_FROM + S2_DUR;   // 723
const S3_DUR  = 104;                // → 827
const S4_FROM = P4_FROM;            // 820
const S4_DUR  = P4_DUR;             // 78 — sigue al audio
const S5_FROM = S4_FROM + S4_DUR;   // 898
const S5_DUR  = 121;                // → 1019
const S6_FROM = S5_FROM + S5_DUR;   // 1019
const S6_DUR  = 132;                // → 1151

export const TresLechesYouTube: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>

      {/* ══════════════════════════════════════════════════════════
          MÚSICA DE FONDO — fadeout al final natural de la música
          ══════════════════════════════════════════════════════════ */}
      <Audio
        src={MUSIC_BG}
        volume={(frame) =>
          interpolate(frame, [1635, 1710], [VOL_MUSIC, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />

      {/* ══════════════════════════════════════════════════════════
          VIDEO PARTE 1 — frames 0–100
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={0} durationInFrames={CUT_FRAME}>
        <AbsoluteFill>
          <Video
            src={VIDEO_SRC}
            volume={VOL_VIDEO}
            style={{width: "100%", height: "100%", objectFit: "cover"}}
          />
        </AbsoluteFill>
        <AbsoluteFill style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 28%, transparent 52%)",
          pointerEvents: "none",
        }} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════
          VIDEO PARTE 2 — frames 235–1710 (completo)
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={VIDEO_RESUME} durationInFrames={V2_DUR}>
        <AbsoluteFill>
          <Video
            src={VIDEO_SRC}
            startFrom={CUT_FRAME}
            volume={(frame) =>
              interpolate(frame, [V2_FADE_AT, V2_DUR], [VOL_VIDEO, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            }
            style={{width: "100%", height: "100%", objectFit: "cover"}}
          />
        </AbsoluteFill>
        <AbsoluteFill style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 28%, transparent 52%)",
          pointerEvents: "none",
        }} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 1 — Intro (frames 0–100) + voz en off
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={0} durationInFrames={CUT_FRAME}>
        <RecipeIntro
          line1="TORTA TRES LECHES"
          line2="DE ALMENDRAS"
          position="center"
        />
      </Sequence>
      <Sequence from={0} durationInFrames={127}>
        <Audio src={INTRO_SRC} volume={1} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════
          WHOOSH entrada — frame 100
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={INGR_FROM} durationInFrames={39}>
        <Audio src={WHOOSH_IN} volume={VOL_WHOOSH} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 2 — Ingredientes (frames 100–260)
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={INGR_FROM} durationInFrames={INGR_DUR}>
        <RecipeIngredientsScreen
          recipeName="TRES LECHES"
          recipeVariant="DE ALMENDRAS"
          servings="4 personas"
          time="40 min"
          fadeInDuration={8}
          fadeOutAt={INGR_FADE_OUT}
          ingredients={[
            {name: "Huevos",                   amount: "2"},
            {name: "Aceite de coco derretido",  amount: "30 ml"},
            {name: "Sirope de agave",           amount: "15g"},
            {name: "Harina de almendras",       amount: "100g"},
            {name: "Polvo para hornear",        amount: "5g"},
            {name: "Leche de coco",             amount: "60 ml"},
            {name: "Leche de almendras",        amount: "60 ml"},
            {name: "Sirope de agave",           amount: "15g"},
            {name: "Extracto de vainilla",      amount: "15 ml"},
            {name: "Yogur griego",              amount: "45g"},
            {name: "Extracto de vainilla",      amount: "15 ml"},
            {name: "Endulzante",               amount: "2g"},
            {name: "Leche de coco",             amount: "2 cdas"},
            {name: "Canela molida"},
          ]}
        />
      </Sequence>
      <Sequence from={INGR_FROM + 50} durationInFrames={51}>
        <Audio src={INGR_VOICE} volume={1} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════
          WHOOSH salida — frame 235
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={VIDEO_RESUME} durationInFrames={39}>
        <Audio src={WHOOSH_OUT} volume={VOL_WHOOSH} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 3 — Pasos: cada audio entra con su tarjeta,
          paso5 y paso6 son secuenciales (paso6 espera a que termine paso5)
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={P1_FROM} durationInFrames={P1_DUR}>
        <Audio src={P1_SRC} volume={1} />
      </Sequence>
      <Sequence from={P2_FROM} durationInFrames={P2_DUR}>
        <Audio src={P2_SRC} volume={1} />
      </Sequence>
      <Sequence from={P3_FROM} durationInFrames={P3_DUR}>
        <Audio src={P3_SRC} volume={1} />
      </Sequence>
      <Sequence from={P4_FROM} durationInFrames={P4_DUR}>
        <Audio src={P4_SRC} volume={1} />
      </Sequence>
      <Sequence from={P5_FROM} durationInFrames={P5_DUR}>
        <Audio src={P5_SRC} volume={1} />
      </Sequence>
      <Sequence from={P6_FROM} durationInFrames={P6_DUR}>
        <Audio src={P6_SRC} volume={1} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════
          StepCards visuales
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={S1_FROM} durationInFrames={S1_DUR}>
        <StepCard stepNumber={1} stepDescription={"PREPARA TU LECHE\nDE ALMENDRAS"} corner="bottomRight" />
      </Sequence>
      <Sequence from={S2_FROM} durationInFrames={S2_DUR}>
        <StepCard stepNumber={2} stepDescription={"MEZCLA HUEVOS,\nACEITE Y AGAVE"} corner="bottomLeft" />
      </Sequence>
      <Sequence from={S3_FROM} durationInFrames={S3_DUR}>
        <StepCard stepNumber={3} stepDescription={"AÑADE HARINA DE\nALMENDRAS Y LEVADURA"} corner="bottomRight" />
      </Sequence>
      <Sequence from={S4_FROM} durationInFrames={S4_DUR}>
        <StepCard stepNumber={4} stepDescription={"HORNEA Y\nDEJA ENFRIAR"} corner="bottomLeft" />
      </Sequence>
      <Sequence from={S5_FROM} durationInFrames={S5_DUR}>
        <StepCard stepNumber={5} stepDescription={"BAÑA CON LA\nMEZCLA TRES LECHES"} corner="bottomRight" />
      </Sequence>
      <Sequence from={S6_FROM} durationInFrames={S6_DUR}>
        <StepCard stepNumber={6} stepDescription={"CUBRE CON YOGUR\nY ESPOLVOREA CANELA"} corner="bottomLeft" />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 4 — Outro + voz final
          Entra cuando terminan todos los pasos (frame 1457)
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={OUTRO_FROM} durationInFrames={OUTRO_DUR}>
        <OutroText
          line1="¡BUEN"
          line2="PROVECHO!"
          hashtag="#NutfruitRecetas"
          cta="Síguenos para más recetas saludables"
          position="center"
        />
      </Sequence>
      <Sequence from={FINAL_FROM} durationInFrames={FINAL_DUR}>
        <Audio src={FINAL_SRC} volume={1} />
      </Sequence>

    </AbsoluteFill>
  );
};
