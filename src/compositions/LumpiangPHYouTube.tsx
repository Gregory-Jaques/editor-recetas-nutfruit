import React from "react";
import {AbsoluteFill, Video, Audio, staticFile, Sequence, interpolate} from "remotion";
import {RecipeIntroPH} from "./nutfruit-recetas/RecipeIntroPH";
import {RecipeIngredientsScreenPH} from "./nutfruit-recetas/RecipeIngredientsScreenPH";
import {StepCardPH} from "./nutfruit-recetas/StepCardPH";
import {OutroTextPH} from "./nutfruit-recetas/OutroTextPH";
import {CountryTheme} from "./nutfruit-recetas/shared";

// ── Audio durations (25 fps) ───────────────────────────────────────────────
//  intro.mp3          → 5.15s  = 129 frames
//  ingredientes.mp3   → 2.06s  =  52 frames
//  pasos y final.mp3  → 46.13s = 1154 frames
//  lumpiang 16x9.mp4  → 60.24s = 1506 frames
// TOTAL composition   = 1641 frames (Root.tsx)

const BASE       = "assets/nutfruit-recetas/ph-lumpiang/";
const VIDEO_SRC  = staticFile(BASE + "lumpiang 16x9.mp4");
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

// pasos y final.mp3 = 1154 frames (audio runs until TOTAL_DUR via open-ended Sequence)

const VIDEO_TOTAL = 1506;
const V2_DUR      = VIDEO_TOTAL - CUT_FRAME;       // 1428 — fórmula crítica
const V2_FADE_AT  = V2_DUR - 50;                   // 1378
const TOTAL_DUR   = VIDEO_RESUME + V2_DUR;         // 1641

// ── Outro ─────────────────────────────────────────────────────────────────────
// Final aparece en el segundo 50 del video original
const OUTRO_FROM = PASOS_FROM + (1250 - CUT_FRAME);  // 1410
const OUTRO_DUR  = TOTAL_DUR - OUTRO_FROM;            //  231

// ── Step cards ────────────────────────────────────────────────────────────────
// Original video timestamps → adjusted comp frames
// Formula: PASOS_FROM + (originalFrame - CUT_FRAME)
//
//  Step 1 →  4s = 100f   Step 2 →  6s = 150f   Step 3 → 11s = 275f
//  Step 4 → 23s = 575f   Step 5 → 34s = 850f   Step 6 → 45s = 1125f

const S1_FROM = PASOS_FROM + (100  - CUT_FRAME);  //  260
const S2_FROM = PASOS_FROM + (150  - CUT_FRAME);  //  310
const S3_FROM = PASOS_FROM + (275  - CUT_FRAME);  //  435
const S4_FROM = PASOS_FROM + (575  - CUT_FRAME);  //  735
const S5_FROM = PASOS_FROM + (850  - CUT_FRAME);  // 1010
const S6_FROM = PASOS_FROM + (1125 - CUT_FRAME);  // 1285

const S1_DUR = S2_FROM - S1_FROM;    //  50
const S2_DUR = S3_FROM - S2_FROM;    // 125
const S3_DUR = S4_FROM - S3_FROM;    // 300
const S4_DUR = S5_FROM - S4_FROM;    // 275
const S5_DUR = S6_FROM - S5_FROM;    // 275
const S6_DUR = OUTRO_FROM - S6_FROM; // 125

export const LumpiangPHYouTube: React.FC = () => {
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
          TEMA FILIPINAS
          accent: #FF3D20 (naranja)  |  dark: #0D1850 (azul marino)
          ══════════════════════════════════════════════════════════ */}
      <CountryTheme country="filipinas">

        {/* ──────────────────────────────────────────────────────
            SECCIÓN 1 — Intro título (frames 0–102)
            ────────────────────────────────────────────────────── */}
        <Sequence from={0} durationInFrames={CUT_FRAME + 25}>
          <RecipeIntroPH
            line1="LUMPIANG"
            line2="CRISPY SPRING ROLLS"
            position="center"
          />
        </Sequence>
        <Sequence from={0} durationInFrames={129}>
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
            recipeName="LUMPIANG"
            recipeVariant="CRISPY SPRING ROLLS"
            servings="4 servings"
            time="60 min"
            fadeInDuration={8}
            fadeOutAt={INGR_FADE_OUT}
            ingredients={[
              {name: "Textured soy",           amount: "500 g"},
              {name: "Soy sauce",              amount: "2 tbsp"},
              {name: "Carrots, finely chopped", amount: "¼ cup"},
              {name: "Green onions",           amount: "¼ cup"},
              {name: "Red pepper",             amount: "½"},
              {name: "Oyster sauce",           amount: "1 tbsp"},
              {name: "Sesame oil",             amount: "2 tsp"},
              {name: "Pine nuts"},
              {name: "Raisins"},
              {name: "Lumpia wrappers"},
              {name: "Cooking oil"},
              {name: "Pineapple juice",        amount: "125 g"},
              {name: "Dates",                  amount: "60 g"},
              {name: "Rice vinegar",           amount: "45 g"},
              {name: "Ketchup",               amount: "60 g"},
              {name: "Garlic cloves",          amount: "2"},
              {name: "Cornstarch",             amount: "1 tbsp"},
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
            SECCIÓN 3 — Pasos + Final (frames 238–1641)
            ────────────────────────────────────────────────────── */}
        <Sequence from={PASOS_FROM} durationInFrames={TOTAL_DUR - PASOS_FROM}>
          <Audio src={staticFile(BASE + "pasos y final_3.mp3")} volume={1.5} />
        </Sequence>

        <Sequence from={S1_FROM} durationInFrames={S1_DUR}>
          <StepCardPH stepNumber={1} stepDescription={"HYDRATE & CHOP\nTHE SOY"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S2_FROM} durationInFrames={S2_DUR}>
          <StepCardPH stepNumber={2} stepDescription={"SOAK RAISINS\nTOAST NUTS"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>
        <Sequence from={S3_FROM} durationInFrames={S3_DUR}>
          <StepCardPH stepNumber={3} stepDescription={"BLEND & MIX\nTHE FILLING"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S4_FROM} durationInFrames={S4_DUR}>
          <StepCardPH stepNumber={4} stepDescription={"ROLL THE\nLUMPIANG"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>
        <Sequence from={S5_FROM} durationInFrames={S5_DUR}>
          <StepCardPH stepNumber={5} stepDescription={"BLEND THE\nSAUCE"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S6_FROM} durationInFrames={S6_DUR}>
          <StepCardPH stepNumber={6} stepDescription={"FRY UNTIL\nCRISPY"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            SECCIÓN 4 — Outro (frame 1410–1641)
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
