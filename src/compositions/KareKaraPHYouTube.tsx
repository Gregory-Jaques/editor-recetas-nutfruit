import React from "react";
import {AbsoluteFill, Video, Audio, staticFile, Sequence, interpolate} from "remotion";
import {RecipeIntroPH} from "./nutfruit-recetas/RecipeIntroPH";
import {RecipeIngredientsScreenPH} from "./nutfruit-recetas/RecipeIngredientsScreenPH";
import {StepCardPH} from "./nutfruit-recetas/StepCardPH";
import {OutroTextPH} from "./nutfruit-recetas/OutroTextPH";
import {CountryTheme} from "./nutfruit-recetas/shared";

// ── Audio durations (25 fps) ───────────────────────────────────────────────
//  intro.mp3          → 5.49s  = 138 frames
//  ingredientes.mp3   → 2.06s  =  52 frames
//  pasos y final.mp3  → 47.02s = 1176 frames
//  Kare Kare 16x9.mp4 → 59.80s = 1495 frames
// TOTAL composition   = 1630 frames (Root.tsx)

const BASE       = "assets/nutfruit-recetas/ph-kare kare/";
const VIDEO_SRC  = staticFile(BASE + "Kare Kare 16x9.mp4");
const WHOOSH_IN  = staticFile(BASE + "whoosh-in.mp3");
const WHOOSH_OUT = staticFile(BASE + "whoosh-out.mp3");
const MUSIC_BG   = staticFile(BASE + "musica.mp3");

const VOL_VIDEO  = 0.15;
const VOL_MUSIC  = 0.10;
const VOL_WHOOSH = 0.35;

// ── Sections ─────────────────────────────────────────────────────────────────
const CUT_FRAME     = 78;
const INGR_DUR      = 160;
const INGR_FROM     = CUT_FRAME;                  //  78
const INGR_FADE_OUT = 135;
const VIDEO_RESUME  = INGR_FROM + INGR_FADE_OUT;  // 213
const PASOS_FROM    = INGR_FROM + INGR_DUR;        // 238

const PASOS_DUR = 1176;                            // pasos y final.mp3
const PASOS_END = PASOS_FROM + PASOS_DUR;          // 1414

const VIDEO_TOTAL = 1495;
const V2_DUR      = VIDEO_TOTAL - CUT_FRAME;       // 1417 — fórmula crítica
const V2_FADE_AT  = V2_DUR - 50;                   // 1367
const TOTAL_DUR   = VIDEO_RESUME + V2_DUR;         // 1630

// ── Outro ─────────────────────────────────────────────────────────────────────
const OUTRO_FROM = PASOS_END;                      // 1414
const OUTRO_DUR  = TOTAL_DUR - OUTRO_FROM;         //  216

// ── Step cards ────────────────────────────────────────────────────────────────
// Original video timestamps → adjusted comp frames
// Formula: PASOS_FROM + (originalFrame - CUT_FRAME)
//
//  Step 1 →  4s = 100f   Step 2 →  8s = 200f   Step 3 → 10s = 250f
//  Step 4 → 16s = 400f   Step 5 → 23s = 575f   Step 6 → 36s = 900f
//  Step 7 → 47s = 1175f

const S1_FROM = PASOS_FROM + (100  - CUT_FRAME);  //  260
const S2_FROM = PASOS_FROM + (200  - CUT_FRAME);  //  360
const S3_FROM = PASOS_FROM + (250  - CUT_FRAME);  //  410
const S4_FROM = PASOS_FROM + (400  - CUT_FRAME);  //  560
const S5_FROM = PASOS_FROM + (575  - CUT_FRAME);  //  735
const S6_FROM = PASOS_FROM + (900  - CUT_FRAME);  // 1060
const S7_FROM = PASOS_FROM + (1175 - CUT_FRAME);  // 1335

const S1_DUR = S2_FROM - S1_FROM;    // 100
const S2_DUR = S3_FROM - S2_FROM;    //  50
const S3_DUR = S4_FROM - S3_FROM;    // 150
const S4_DUR = S5_FROM - S4_FROM;    // 175
const S5_DUR = S6_FROM - S5_FROM;    // 325
const S6_DUR = S7_FROM - S6_FROM;    // 275
const S7_DUR = TOTAL_DUR - S7_FROM;  // 295

export const KareKaraPHYouTube: React.FC = () => {
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
          VIDEO PARTE 1 — frames 0–99 (+ 22f extra para que el
          panel de ingredientes entre mientras el video sigue visible)
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
          TEMA FILIPINAS
          accent: #FF3D20 (naranja)  |  dark: #0D1850 (azul marino)
          ══════════════════════════════════════════════════════════ */}
      <CountryTheme country="filipinas">

        {/* ──────────────────────────────────────────────────────
            SECCIÓN 1 — Intro título (frames 0–102)
            ────────────────────────────────────────────────────── */}
        <Sequence from={0} durationInFrames={CUT_FRAME + 25}>
          <RecipeIntroPH
            line1="KARE KARE"
            line2="BEEF IN PEANUT SAUCE"
            position="center"
          />
        </Sequence>
        <Sequence from={0} durationInFrames={138}>
          <Audio src={staticFile(BASE + "intro.mp3")} volume={1} />
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
            recipeName="KARE KARE"
            recipeVariant="BEEF IN PEANUT SAUCE"
            servings="4 servings"
            time="120 min"
            fadeInDuration={8}
            fadeOutAt={INGR_FADE_OUT}
            ingredients={[
              {name: "Peanuts",                 amount: "100 g"},
              {name: "Stewing beef",            amount: "0.5 kg"},
              {name: "Onion, chopped",          amount: "1"},
              {name: "Garlic cloves, chopped",  amount: "2"},
              {name: "Fish sauce",              amount: "2 tbsp"},
              {name: "Salt & pepper"},
              {name: "Beef broth"},
              {name: "Annatto (achiote)"},
              {name: "Toasted ground rice",     amount: "100 g"},
              {name: "Bok choy",                amount: "3"},
              {name: "Green beans",             amount: "200 g"},
              {name: "Chinese eggplants",       amount: "2"},
              {name: "Macadamia nuts",          amount: "20 g"},
            ]}
          />
        </Sequence>

        {/* Voz ingredientes — entra 2s después del whoosh */}
        <Sequence from={INGR_FROM + 50} durationInFrames={52}>
          <Audio src={staticFile(BASE + "ingredientes.mp3")} volume={1} />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            WHOOSH salida — frame 213
            ────────────────────────────────────────────────────── */}
        <Sequence from={VIDEO_RESUME} durationInFrames={39}>
          <Audio src={WHOOSH_OUT} volume={VOL_WHOOSH} />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            SECCIÓN 3 — Pasos + Final (frames 238–1413)
            ────────────────────────────────────────────────────── */}
        <Sequence from={PASOS_FROM} durationInFrames={TOTAL_DUR - PASOS_FROM}>
          <Audio src={staticFile(BASE + "pasos y final.mp3")} volume={1.5} />
        </Sequence>

        <Sequence from={S1_FROM} durationInFrames={S1_DUR}>
          <StepCardPH stepNumber={1} stepDescription={"ROAST PEANUTS\nIN OVEN"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S2_FROM} durationInFrames={S2_DUR}>
          <StepCardPH stepNumber={2} stepDescription={"BROWN THE\nBEEF"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>
        <Sequence from={S3_FROM} durationInFrames={S3_DUR}>
          <StepCardPH stepNumber={3} stepDescription={"CHOP & ADD\nMACADAMIA"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S4_FROM} durationInFrames={S4_DUR}>
          <StepCardPH stepNumber={4} stepDescription={"ADD BROTH\n& SIMMER"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>
        <Sequence from={S5_FROM} durationInFrames={S5_DUR}>
          <StepCardPH stepNumber={5} stepDescription={"BLEND THE\nPEANUT SAUCE"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S6_FROM} durationInFrames={S6_DUR}>
          <StepCardPH stepNumber={6} stepDescription={"COOK THE\nVEGETABLES"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>
        <Sequence from={S7_FROM} durationInFrames={S7_DUR}>
          <StepCardPH stepNumber={7} stepDescription={"SERVE &\nGARNISH"} corner="bottomRight" bottomOffset={120} />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            SECCIÓN 4 — Outro (frame 1414–1630)
            ────────────────────────────────────────────────────── */}
        <Sequence from={OUTRO_FROM} durationInFrames={OUTRO_DUR}>
          <OutroTextPH
            line1="ENJOY"
            line2="YOUR MEAL!"
            hashtag="#NutfruitRecetas"
            cta="More healthy recipes every week on Nutfruit"
            position="center"
          />
        </Sequence>

      </CountryTheme>

    </AbsoluteFill>
  );
};
