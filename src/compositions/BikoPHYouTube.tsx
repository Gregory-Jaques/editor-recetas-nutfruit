import React from "react";
import {AbsoluteFill, Video, Audio, staticFile, Sequence, interpolate} from "remotion";
import {RecipeIntroPH} from "./nutfruit-recetas/RecipeIntroPH";
import {RecipeIngredientsScreenPH} from "./nutfruit-recetas/RecipeIngredientsScreenPH";
import {StepCardPH} from "./nutfruit-recetas/StepCardPH";
import {OutroTextPH} from "./nutfruit-recetas/OutroTextPH";
import {CountryTheme} from "./nutfruit-recetas/shared";

// ── Assets ────────────────────────────────────────────────────────────────────
const BASE       = "assets/nutfruit-recetas/ph-biko/";
const VIDEO_SRC  = staticFile(BASE + "Biko 16x9.mp4");
const WHOOSH_IN  = staticFile(BASE + "whoosh-in.mp3");
const WHOOSH_OUT = staticFile(BASE + "whoosh-out.mp3");
const MUSIC_BG   = staticFile(BASE + "musica.mp3");
const INTRO_SRC  = staticFile(BASE + "intro.mp3");
const INGR_VOICE = staticFile(BASE + "ingredientes.mp3");
const PASOS_SRC  = staticFile(BASE + "pasos y final.mp3");

// ── Volumes ───────────────────────────────────────────────────────────────────
const VOL_VIDEO  = 0.15;
const VOL_MUSIC  = 0.10;
const VOL_WHOOSH = 0.35;

// ── Timing constants (25 fps) ─────────────────────────────────────────────────
//  intro.mp3          → 5.07s  = 127 frames
//  ingredientes.mp3   → 2.04s  =  51 frames
//  pasos y final.mp3  → 24.08s = 603 frames
//  whoosh-in/out.mp3  → 1.56s  =  39 frames
//  Biko 16x9.mp4      → 37.60s = 940 frames
// TOTAL = 1075 frames (Root.tsx)

const CUT_FRAME     = 78;
const INGR_DUR      = 160;
const INGR_FROM     = CUT_FRAME;                 // 78
const INGR_FADE_OUT = 135;
const VIDEO_RESUME  = INGR_FROM + INGR_FADE_OUT; // 213

const PASOS_FROM = INGR_FROM + INGR_DUR;         // 238
const PASOS_DUR  = 849;                          // pasos y final.mp3 = 33.93s

const OUTRO_FROM = 911;
const OUTRO_DUR  = 97;                           // termina en frame 1008

const VIDEO_TOTAL = 940;
const V2_DUR      = VIDEO_TOTAL - CUT_FRAME;     // 862 — fórmula crítica
const V2_FADE_AT  = V2_DUR - 50;                 // 812
const TOTAL_DUR   = VIDEO_RESUME + V2_DUR;       // 1075

// ── Step card frames (ajustar tras revisar video)
const S1_FROM = 238;
const S2_FROM = 332;  // step 2 va 332–598 (266 frames ≈ 10.6s)
const S3_FROM = 598;
const S4_FROM = 747;
const S5_FROM = 838;

export const BikoPHYouTube: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>

      {/* ══════════════════════════════════════════════════════════
          MÚSICA DE FONDO — fadeout al final de la composición
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
          VIDEO PARTE 1 — frames 0–100
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
          VIDEO PARTE 2 — frame 213 en adelante (retoma desde CUT_FRAME)
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
          TEMA FILIPINAS — accent: #FF3D20  |  dark: #0D1850
          ══════════════════════════════════════════════════════════ */}
      <CountryTheme country="filipinas">

        {/* ──────────────────────────────────────────────────────
            SECCIÓN 1 — Intro (frames 0–103)
            ────────────────────────────────────────────────────── */}
        <Sequence from={0} durationInFrames={CUT_FRAME + 25}>
          <RecipeIntroPH
            line1="BIKO"
            line2="FILIPINO STICKY RICE CAKE"
            position="center"
          />
        </Sequence>
        <Sequence from={10} durationInFrames={127}>
          <Audio src={INTRO_SRC} volume={1} />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            WHOOSH entrada — frame 78
            ────────────────────────────────────────────────────── */}
        <Sequence from={INGR_FROM} durationInFrames={39}>
          <Audio src={WHOOSH_IN} volume={VOL_WHOOSH} />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            SECCIÓN 2 — Ingredientes (frames 78–238)
            ────────────────────────────────────────────────────── */}
        <Sequence from={INGR_FROM} durationInFrames={INGR_DUR}>
          <RecipeIngredientsScreenPH
            recipeName="BIKO"
            recipeVariant="FILIPINO STICKY RICE CAKE"
            servings="6 servings"
            time="55 min"
            fadeInDuration={8}
            fadeOutAt={INGR_FADE_OUT}
            ingredients={[
              {name: "Glutinous rice, washed",  amount: "320 g"},
              {name: "Canned coconut milk",      amount: "240 g"},
              {name: "Water",                    amount: "240 g"},
              {name: "Pandan leaves",            amount: "2 pcs"},
              {name: "Dark brown sugar",         amount: "50 g"},
              {name: "Hazelnuts",                amount: "100 g"},
              {name: "Water (hazelnut drink)",   amount: "450 ml"},
              {name: "Canned coconut milk",      amount: "400 g"},
              {name: "Hazelnut drink",           amount: "200 g"},
              {name: "Dark brown sugar",         amount: "200 g"},
              {name: "Vanilla",                  amount: "1 tsp"},
              {name: "Dried figs",               amount: "40 g"},
              {name: "Nuts",                     amount: "40 g"},
            ]}
          />
        </Sequence>
        <Sequence from={INGR_FROM + 50} durationInFrames={51}>
          <Audio src={INGR_VOICE} volume={1} />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            WHOOSH salida — frame 213
            ────────────────────────────────────────────────────── */}
        <Sequence from={VIDEO_RESUME} durationInFrames={39}>
          <Audio src={WHOOSH_OUT} volume={VOL_WHOOSH} />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            SECCIÓN 3 — Pasos (frames 238–841)
            ────────────────────────────────────────────────────── */}
        <Sequence from={PASOS_FROM} durationInFrames={PASOS_DUR}>
          <Audio src={PASOS_SRC} volume={1} />
        </Sequence>

        <Sequence from={S1_FROM} durationInFrames={S2_FROM - S1_FROM}>
          <StepCardPH stepNumber={1} stepDescription={"CRUSH THE\nWALNUTS"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S2_FROM} durationInFrames={S3_FROM - S2_FROM}>
          <StepCardPH stepNumber={2} stepDescription={"PREPARE THE\nBATTER"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>
        <Sequence from={S3_FROM} durationInFrames={S4_FROM - S3_FROM}>
          <StepCardPH stepNumber={3} stepDescription={"FILL AND\nBAKE"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S4_FROM} durationInFrames={S5_FROM - S4_FROM}>
          <StepCardPH stepNumber={4} stepDescription={"CHOP THE\nPISTACHIOS"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>
        <Sequence from={S5_FROM} durationInFrames={OUTRO_FROM - S5_FROM}>
          <StepCardPH stepNumber={5} stepDescription={"ADD PISTACHIO\nAND COCONUT"} corner="bottomRight" bottomOffset={120} />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            SECCIÓN 4 — Outro (frame 841)
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
