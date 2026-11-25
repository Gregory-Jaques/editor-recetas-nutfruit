import React from "react";
import {AbsoluteFill, Video, Audio, staticFile, Sequence, interpolate} from "remotion";
import {RecipeIntroPH} from "./nutfruit-recetas/RecipeIntroPH";
import {RecipeIngredientsScreenPH} from "./nutfruit-recetas/RecipeIngredientsScreenPH";
import {StepCardPH} from "./nutfruit-recetas/StepCardPH";
import {OutroTextPH} from "./nutfruit-recetas/OutroTextPH";
import {CountryTheme} from "./nutfruit-recetas/shared";

// ── Audio durations (25 fps) ───────────────────────────────────────────────
//  intro.mp3               → 5.77s  = 145 frames
//  ingredientes.mp3        → 2.04s  =  51 frames
//  pasos y final.mp3       → 49.74s = 1244 frames
//  Chicken satay_16x9.mp4  → 58.96s = 1474 frames
// TOTAL composition        = 1609 frames (Root.tsx)

const BASE       = "assets/nutfruit-recetas/thai-chicken satay/";
const VIDEO_SRC  = staticFile(BASE + "Chicken satay_16x9.mp4");
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

const VIDEO_TOTAL = 1474;
const V2_DUR      = VIDEO_TOTAL - CUT_FRAME;       // 1396 — fórmula crítica
const V2_FADE_AT  = V2_DUR - 50;                   // 1346
const TOTAL_DUR   = VIDEO_RESUME + V2_DUR;         // 1609

// ── Outro ─────────────────────────────────────────────────────────────────────
// Outro aparece en el segundo 42 del video original
const OUTRO_FROM = PASOS_FROM + (1050 - CUT_FRAME);  // 1210
const OUTRO_DUR  = TOTAL_DUR - OUTRO_FROM;            //  399

// ── Step cards ────────────────────────────────────────────────────────────────
// Original video timestamps → adjusted comp frames
// Formula: PASOS_FROM + (originalFrame - CUT_FRAME)
//
//  Step 1 →  4s = 100f   Step 2 →  9s = 225f   Step 3 → 14s = 350f
//  Step 4 → 29s = 725f   Step 5 → 35s = 875f   Step 6 → 37s = 925f

const S1_FROM = PASOS_FROM + (100 - CUT_FRAME);   //  260
const S2_FROM = PASOS_FROM + (225 - CUT_FRAME);   //  385
const S3_FROM = PASOS_FROM + (350 - CUT_FRAME);   //  510
const S4_FROM = PASOS_FROM + (725 - CUT_FRAME);   //  885
const S5_FROM = PASOS_FROM + (875 - CUT_FRAME) - 50; //  985 (−2s, mismo fin)
const S6_FROM = PASOS_FROM + (925 - CUT_FRAME);   // 1085

const S1_DUR = S2_FROM - S1_FROM;    // 125
const S2_DUR = S3_FROM - S2_FROM;    // 125
const S3_DUR = S4_FROM - S3_FROM;    // 375
const S4_DUR = S5_FROM - S4_FROM;    // 150
const S5_DUR = S6_FROM - S5_FROM;    //  50
const S6_DUR = OUTRO_FROM - S6_FROM; // 125

export const ChickenSatayThaiYouTube: React.FC = () => {
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
            line1="CHICKEN SATAY"
            line2="WITH PRUNE & NUT SAUCE"
            position="center"
          />
        </Sequence>
        <Sequence from={0} durationInFrames={145}>
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
            recipeName="CHICKEN SATAY"
            recipeVariant="WITH PRUNE & NUT SAUCE"
            servings="2 servings"
            time="2h 30 min"
            fadeInDuration={8}
            fadeOutAt={INGR_FADE_OUT}
            ingredients={[
              {name: "Sugar",              amount: "1 tbsp"},
              {name: "Tamarind paste",     amount: "1 tbsp"},
              {name: "Yellow curry paste", amount: "1 tbsp"},
              {name: "Curry powder",       amount: "½ tbsp"},
              {name: "Fish sauce",         amount: "1 tbsp"},
              {name: "Chicken thighs",     amount: "400 g"},
              {name: "Prunes",             amount: "6"},
              {name: "Macadamia nuts",     amount: "30 g"},
              {name: "Yellow curry paste", amount: "1 tbsp"},
              {name: "Coconut drink",      amount: "100 ml"},
              {name: "Lime",               amount: "1"},
              {name: "Fish sauce",         amount: "1 tbsp"},
              {name: "Brazil nuts",        amount: "6"},
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
            SECCIÓN 3 — Pasos + Final (frames 238–1609)
            ────────────────────────────────────────────────────── */}
        <Sequence from={PASOS_FROM} durationInFrames={TOTAL_DUR - PASOS_FROM}>
          <Audio src={staticFile(BASE + "pasos y final_2.mp3")} volume={1.5} />
        </Sequence>

        <Sequence from={S1_FROM} durationInFrames={S1_DUR}>
          <StepCardPH stepNumber={1} stepDescription={"MAKE THE\nMARINADE"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S2_FROM} durationInFrames={S2_DUR}>
          <StepCardPH stepNumber={2} stepDescription={"MARINATE THE\nCHICKEN"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>
        <Sequence from={S3_FROM} durationInFrames={S3_DUR}>
          <StepCardPH stepNumber={3} stepDescription={"BLEND THE\nSAUCE BASE"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S4_FROM} durationInFrames={S4_DUR}>
          <StepCardPH stepNumber={4} stepDescription={"ADD NUTS\n& LIME"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>
        <Sequence from={S5_FROM} durationInFrames={S5_DUR}>
          <StepCardPH stepNumber={5} stepDescription={"THREAD ON\nSKEWERS"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S6_FROM} durationInFrames={S6_DUR}>
          <StepCardPH stepNumber={6} stepDescription={"GRILL THE\nCHICKEN"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            SECCIÓN 4 — Outro (frame 1210–1609)
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
