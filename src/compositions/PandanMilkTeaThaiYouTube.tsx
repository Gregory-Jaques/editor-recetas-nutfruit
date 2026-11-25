import React from "react";
import {AbsoluteFill, Video, Audio, staticFile, Sequence, interpolate} from "remotion";
import {RecipeIntroPH} from "./nutfruit-recetas/RecipeIntroPH";
import {RecipeIngredientsScreenPH} from "./nutfruit-recetas/RecipeIngredientsScreenPH";
import {StepCardPH} from "./nutfruit-recetas/StepCardPH";
import {OutroTextPH} from "./nutfruit-recetas/OutroTextPH";
import {CountryTheme} from "./nutfruit-recetas/shared";

// ── Audio durations (25 fps) ────────────────────────────────────────────────
//  intro e ingredientes.mp3  →  7.24s  = 181 frames  (arranca en frame 0)
//  pasos y final_4.mp3       → 33.25s  = 832 frames
//  Pandan milk tea_16x9.mp4  → 41.07s  = 1027 frames
// TOTAL composition          = 1162 frames (Root.tsx)

const BASE       = "assets/nutfruit-recetas/thai-pandan milk tea/";
const VIDEO_SRC  = staticFile(BASE + "Pandan milk tea_16x9.mp4");
const WHOOSH_IN  = staticFile(BASE + "whoosh-in.mp3");
const WHOOSH_OUT = staticFile(BASE + "whoosh-out.mp3");
const MUSIC_BG   = staticFile(BASE + "musica.mp3");

const VOL_VIDEO  = 0.15;
const VOL_MUSIC  = 0.10;
const VOL_WHOOSH = 0.35;

// ── Sections ──────────────────────────────────────────────────────────────────
const CUT_FRAME     = 78;
const INGR_DUR      = 160;
const INGR_FROM     = CUT_FRAME;                  //  78
const INGR_FADE_OUT = 135;
const VIDEO_RESUME  = INGR_FROM + INGR_FADE_OUT;  // 213
const PASOS_FROM    = INGR_FROM + INGR_DUR;        // 238

const VIDEO_TOTAL = 1027;
const V2_DUR      = VIDEO_TOTAL - CUT_FRAME;       //  949 — fórmula crítica
const V2_FADE_AT  = V2_DUR - 50;                   //  899
const TOTAL_DUR   = VIDEO_RESUME + V2_DUR;         // 1162

// ── Outro ─────────────────────────────────────────────────────────────────────
// Final aparece en el segundo 32 del video original
const OUTRO_FROM = PASOS_FROM + (800 - CUT_FRAME);  //  960
const OUTRO_DUR  = 123;                              //  termina en frame 1083

// ── Step cards ────────────────────────────────────────────────────────────────
// Original video timestamps → adjusted comp frames
// Formula: PASOS_FROM + (originalFrame - CUT_FRAME)
//
//  Step 1 →  4s = 100f   Step 2 → 11s = 275f   Step 3 → 20s = 500f
//  Step 4 → 23s = 575f   Step 5 → 25s = 625f   Step 6 → 28s = 700f

const S1_FROM = PASOS_FROM + (100 - CUT_FRAME);   //  260
const S2_FROM = PASOS_FROM + (275 - CUT_FRAME);   //  435
const S3_FROM = PASOS_FROM + (500 - CUT_FRAME);   //  660
const S4_FROM = PASOS_FROM + (575 - CUT_FRAME);   //  735
const S5_FROM = PASOS_FROM + (625 - CUT_FRAME);   //  785
const S6_FROM = PASOS_FROM + (700 - CUT_FRAME);   //  860

const S1_DUR = S2_FROM - S1_FROM;    // 175
const S2_DUR = S3_FROM - S2_FROM;    // 225
const S3_DUR = S4_FROM - S3_FROM;    //  75
const S4_DUR = S5_FROM - S4_FROM + 50; //  100 (+2s overlap con paso 5)
const S5_DUR = S6_FROM - S5_FROM;    //  75
const S6_DUR = OUTRO_FROM - S6_FROM; // 100

export const PandanMilkTeaThaiYouTube: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>

      {/* ══════════════════════════════════════════════════════════
          MÚSICA DE FONDO — fadeout en los últimos 3s
          ══════════════════════════════════════════════════════════ */}
      <Audio
        src={MUSIC_BG}
        volume={(frame) =>
          interpolate(frame, [TOTAL_DUR - 75, TOTAL_DUR], [VOL_MUSIC, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />

      {/* ══════════════════════════════════════════════════════════
          VIDEO PARTE 1 — frames 0–99 (+ 22f extra de overlap)
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={0} durationInFrames={CUT_FRAME + 22}>
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
          VIDEO PARTE 2 — retoma desde CUT_FRAME (frame 213 en adelante)
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
          TEMA TAILANDIA
          accent: #ec1d25 (rojo)  |  dark: #231e50 (azul noche)
          ══════════════════════════════════════════════════════════ */}
      <CountryTheme country="tailandia">

        {/* ──────────────────────────────────────────────────────
            SECCIÓN 1 — Intro título (frames 0–102)
            ────────────────────────────────────────────────────── */}
        <Sequence from={0} durationInFrames={CUT_FRAME + 25}>
          <RecipeIntroPH
            line1="PANDAN MILK TEA"
            line2="WITH HAZELNUT DRINK"
            position="center"
          />
        </Sequence>

        {/* Intro + ingredientes combinados — arranca en frame 0 */}
        <Sequence from={0} durationInFrames={181}>
          <Audio src={staticFile(BASE + "intro e ingredientes.mp3")} volume={1} />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            WHOOSH entrada — frame 78
            ────────────────────────────────────────────────────── */}
        <Sequence from={INGR_FROM} durationInFrames={39}>
          <Audio src={WHOOSH_IN} volume={VOL_WHOOSH} />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            SECCIÓN 2 — Ingredientes (frames 78–237)
            ────────────────────────────────────────────────────── */}
        <Sequence from={INGR_FROM} durationInFrames={INGR_DUR}>
          <RecipeIngredientsScreenPH
            recipeName="PANDAN MILK TEA"
            recipeVariant="WITH HAZELNUT DRINK"
            servings="2 servings"
            time="30 min"
            fadeInDuration={8}
            fadeOutAt={INGR_FADE_OUT}
            ingredients={[
              {name: "Pandan leaves"},
              {name: "Water",              amount: "100 g"},
              {name: "Sugar",              amount: "100 g"},
              {name: "Hazelnuts",          amount: "100 g"},
              {name: "Water",              amount: "450 ml"},
              {name: "Black tea"},
              {name: "Crushed ice"},
              {name: "Coconut drink",      amount: "40 ml"},
              {name: "Pandan syrup"},
              {name: "Chopped hazelnuts",  amount: "garnish"},
            ]}
          />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            WHOOSH salida — frame 213
            ────────────────────────────────────────────────────── */}
        <Sequence from={VIDEO_RESUME} durationInFrames={39}>
          <Audio src={WHOOSH_OUT} volume={VOL_WHOOSH} />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            SECCIÓN 3 — Pasos + Final (frames 238–1162)
            ────────────────────────────────────────────────────── */}
        <Sequence from={PASOS_FROM} durationInFrames={TOTAL_DUR - PASOS_FROM}>
          <Audio src={staticFile(BASE + "pasos y final_6.mp3")} volume={1.5} />
        </Sequence>

        <Sequence from={S1_FROM} durationInFrames={S1_DUR}>
          <StepCardPH stepNumber={1} stepDescription={"BLEND THE\nPANDAN SYRUP"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S2_FROM} durationInFrames={S2_DUR}>
          <StepCardPH stepNumber={2} stepDescription={"MAKE HAZELNUT\nDRINK"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>
        <Sequence from={S3_FROM} durationInFrames={S3_DUR}>
          <StepCardPH stepNumber={3} stepDescription={"BREW THE\nBLACK TEA"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S4_FROM} durationInFrames={S4_DUR}>
          <StepCardPH stepNumber={4} stepDescription={"FILL WITH\nICE & TEA"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>
        <Sequence from={S5_FROM} durationInFrames={S5_DUR}>
          <StepCardPH stepNumber={5} stepDescription={"ADD HAZELNUT\n& COCONUT"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S6_FROM} durationInFrames={S6_DUR}>
          <StepCardPH stepNumber={6} stepDescription={"POUR THE\nPANDAN SYRUP"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            SECCIÓN 4 — Outro (frame 960–1162)
            ────────────────────────────────────────────────────── */}
        <Sequence from={OUTRO_FROM} durationInFrames={OUTRO_DUR}>
          <OutroTextPH
            line1="ENJOY"
            line2="YOUR DRINK!"
            hashtag="#NutfruitRecetas"
            cta="More healthy recipes every week on Nutfruit"
            position="center"
          />
        </Sequence>

      </CountryTheme>

    </AbsoluteFill>
  );
};
