import React from "react";
import {AbsoluteFill, Video, Audio, staticFile, Sequence, interpolate} from "remotion";
import {RecipeIntroPH} from "./nutfruit-recetas/RecipeIntroPH";
import {RecipeIngredientsScreenPH} from "./nutfruit-recetas/RecipeIngredientsScreenPH";
import {StepCardPH} from "./nutfruit-recetas/StepCardPH";
import {OutroTextPH} from "./nutfruit-recetas/OutroTextPH";
import {CountryTheme} from "./nutfruit-recetas/shared";

// ── Audio durations (25 fps) ───────────────────────────────────────────────
//  intro e ingredientes.mp3  →  7.97s =  200 frames
//  pasos y final.mp3         → 54.07s = 1352 frames
//  Veggie pad thai_16x9.mp4  → 53.44s = 1336 frames
// TOTAL composition          = 1471 frames (Root.tsx)

const BASE       = "assets/nutfruit-recetas/thai-veggie pad thai/";
const VIDEO_SRC  = staticFile(BASE + "Veggie pad thai_16x9.mp4");
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

const VIDEO_TOTAL = 1336;
const V2_DUR      = VIDEO_TOTAL - CUT_FRAME;       // 1258 — fórmula crítica
const V2_FADE_AT  = V2_DUR - 50;                   // 1208
const TOTAL_DUR   = VIDEO_RESUME + V2_DUR;         // 1471

// ── Outro ─────────────────────────────────────────────────────────────────────
// Final aparece en el segundo 40 del video original
const OUTRO_FROM = PASOS_FROM + (1000 - CUT_FRAME);  // 1160
const OUTRO_DUR  = TOTAL_DUR - OUTRO_FROM;            //  311

// ── Step cards ────────────────────────────────────────────────────────────────
// Original video timestamps → adjusted comp frames
// Formula: PASOS_FROM + (originalFrame - CUT_FRAME)
//
//  Step 1 →  4s = 100f   Step 2 →  7s = 175f   Step 3 → 12s = 300f
//  Step 4 → 16s = 400f   Step 5 → 19s = 475f
//  Step 6 → comp frame 750 (30s composición)
//  Step 7 → 27s video = 675f   Step 8 → 34s = 850f

const S1_FROM = PASOS_FROM + (100 - CUT_FRAME);   //  260
const S2_FROM = PASOS_FROM + (175 - CUT_FRAME);   //  335
const S3_FROM = PASOS_FROM + (300 - CUT_FRAME);   //  460
const S4_FROM = PASOS_FROM + (400 - CUT_FRAME);   //  560
const S5_FROM = PASOS_FROM + (475 - CUT_FRAME);   //  635
const S6_FROM = 750;                               //  750 (30s composición)
const S7_FROM = PASOS_FROM + (675 - CUT_FRAME);   //  835
const S8_FROM = PASOS_FROM + (850 - CUT_FRAME);   // 1010

const S1_DUR = S2_FROM - S1_FROM;    //  75
const S2_DUR = S3_FROM - S2_FROM;    // 125
const S3_DUR = S4_FROM - S3_FROM;    // 100
const S4_DUR = S5_FROM - S4_FROM;    //  75
const S5_DUR = S6_FROM - S5_FROM;    // 115
const S6_DUR = S7_FROM - S6_FROM;    //  85
const S7_DUR = S8_FROM - S7_FROM;    // 175
const S8_DUR = OUTRO_FROM - S8_FROM; // 150

export const VeggiePadThaiThaiYouTube: React.FC = () => {
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
            line1="VEGGIE PAD THAI"
            line2="WITH NUTS & TOFU"
            position="center"
          />
        </Sequence>
        <Sequence from={0} durationInFrames={200}>
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
            recipeName="VEGGIE PAD THAI"
            recipeVariant="WITH NUTS & TOFU"
            servings="2 servings"
            time="50 min"
            fadeInDuration={8}
            fadeOutAt={INGR_FADE_OUT}
            ingredients={[
              {name: "Dates",                    amount: "4"},
              {name: "Tamarind paste",           amount: "3 tbsp"},
              {name: "Fish sauce",               amount: "2 tbsp"},
              {name: "Medium rice noodles",      amount: "150 g"},
              {name: "Peanut oil",               amount: "4 tbsp"},
              {name: "Shallots, chopped",        amount: "2"},
              {name: "Garlic cloves, chopped",   amount: "3"},
              {name: "Tofu, cubed",              amount: "200 g"},
              {name: "Bean sprouts",             amount: "100 g"},
              {name: "Eggs",                     amount: "2"},
              {name: "Chives"},
              {name: "Peanuts",                  amount: "20 g"},
              {name: "Almonds",                  amount: "20 g"},
              {name: "Lime",                     amount: "1"},
              {name: "Fresh cilantro"},
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
            SECCIÓN 3 — Pasos + Final (frames 238–1471)
            ────────────────────────────────────────────────────── */}
        <Sequence from={PASOS_FROM} durationInFrames={TOTAL_DUR - PASOS_FROM}>
          <Audio src={staticFile(BASE + "pasos y final_4.mp3")} volume={1.5} />
        </Sequence>

        <Sequence from={S1_FROM} durationInFrames={S1_DUR}>
          <StepCardPH stepNumber={1} stepDescription={"SOAK THE\nNOODLES"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S2_FROM} durationInFrames={S2_DUR}>
          <StepCardPH stepNumber={2} stepDescription={"CHOP THE\nNUTS"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>
        <Sequence from={S3_FROM} durationInFrames={S3_DUR}>
          <StepCardPH stepNumber={3} stepDescription={"TOAST THE\nNUTS"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S4_FROM} durationInFrames={S4_DUR}>
          <StepCardPH stepNumber={4} stepDescription={"SOAK THE\nDATES"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>
        <Sequence from={S5_FROM} durationInFrames={S5_DUR}>
          <StepCardPH stepNumber={5} stepDescription={"FRY TOFU\n& AROMATICS"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S6_FROM} durationInFrames={S6_DUR}>
          <StepCardPH stepNumber={6} stepDescription={"ADD THE\nNOODLES"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>
        <Sequence from={S7_FROM} durationInFrames={S7_DUR}>
          <StepCardPH stepNumber={7} stepDescription={"ADD SPROUTS\n& EGGS"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S8_FROM} durationInFrames={S8_DUR}>
          <StepCardPH stepNumber={8} stepDescription={"BLEND DATES\n& ADD SAUCE"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            SECCIÓN 4 — Outro (frame 1160–1471)
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
