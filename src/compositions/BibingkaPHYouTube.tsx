import React from "react";
import {AbsoluteFill, Video, Audio, staticFile, Sequence, interpolate} from "remotion";
import {RecipeIntroPH} from "./nutfruit-recetas/RecipeIntroPH";
import {RecipeIngredientsScreenPH} from "./nutfruit-recetas/RecipeIngredientsScreenPH";
import {StepCardPH} from "./nutfruit-recetas/StepCardPH";
import {OutroTextPH} from "./nutfruit-recetas/OutroTextPH";
import {CountryTheme} from "./nutfruit-recetas/shared";

// ── Assets ────────────────────────────────────────────────────────────────────
const BASE      = "assets/nutfruit-recetas/bibingka/";
const VIDEO_SRC = staticFile(BASE + "babinka 16x9.mp4");
const WHOOSH_IN = staticFile(BASE + "whoosh-in.mp3");
const WHOOSH_OUT= staticFile(BASE + "whoosh-out.mp3");
const MUSIC_BG  = staticFile(BASE + "musica.mp3");
const INTRO_SRC = staticFile(BASE + "intro.mp3");
const INGR_VOICE= staticFile(BASE + "ingredientes.mp3");
const PASOS_SRC = staticFile(BASE + "pasos.mp3");

// ── Volumes ───────────────────────────────────────────────────────────────────
const VOL_VIDEO  = 0.15;
const VOL_MUSIC  = 0.10;
const VOL_WHOOSH = 0.35;

// ── Timing constants (25 fps) ─────────────────────────────────────────────────
//  intro.mp3        → 4.21s  = 106 frames
//  ingredientes.mp3 → 2.04s  =  51 frames
//  pasos.mp3        → 42.76s = 1070 frames (pasos + final)
//  whoosh-in/out    → 1.56s  =  39 frames
//  babinka 16x9.mp4 → 62.92s = 1573 frames
// TOTAL = 1708 frames (Root.tsx)

const CUT_FRAME     = 100;
const INGR_DUR      = 160;
const INGR_FROM     = CUT_FRAME;                 // 100
const INGR_FADE_OUT = 135;
const VIDEO_RESUME  = INGR_FROM + INGR_FADE_OUT; // 235

const PASOS_FROM = INGR_FROM + INGR_DUR;         // 260
const PASOS_DUR  = 1337;                         // pasos.mp3 termina en frame 1597

const OUTRO_FROM = 1455;
const OUTRO_DUR  = 160;

const VIDEO_TOTAL = 1573;
const V2_DUR      = VIDEO_TOTAL - CUT_FRAME;     // 1473 — fórmula crítica
const V2_FADE_AT  = V2_DUR - 50;                 // 1423
const TOTAL_DUR   = VIDEO_RESUME + V2_DUR;       // 1708

// ── Step card frames (composition timeline) ───────────────────────────────────
// formula: VIDEO_RESUME + (video_second * 25 - CUT_FRAME)
// S1: video 4s cae antes del corte → se coloca al inicio de la Sección 3
const S1_FROM = PASOS_FROM;  // 260
const S2_FROM = 510;         // video 15s
const S3_FROM = 585;         // video 18s
const S4_FROM = 635;         // video 20s
const S5_FROM = 760;         // video 25s
const S6_FROM = 1024;        // caramel
const S7_FROM = 1356;        // dried figs

export const BibingkaPHYouTube: React.FC = () => {
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
          VIDEO PARTE 1 — frames 0–100 (22f extra para que el panel
          entre desde la derecha sin cortar el video abruptamente)
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
            line1="BIBINGKA"
            line2="FILIPINO RICE CAKE"
            position="center"
          />
        </Sequence>
        <Sequence from={10} durationInFrames={106}>
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
            recipeName="BIBINGKA"
            recipeVariant="FILIPINO RICE CAKE"
            servings="4 servings"
            time="55 min"
            fadeInDuration={8}
            fadeOutAt={INGR_FADE_OUT}
            ingredients={[
              {name: "Glutinous rice flour",    amount: "160 g"},
              {name: "Pecans",                  amount: "50 g"},
              {name: "Walnuts",                 amount: "50 g"},
              {name: "Baking powder",           amount: "2 tsp"},
              {name: "Salt",                    amount: "¼ tsp"},
              {name: "Eggs",                    amount: "3"},
              {name: "Unsalted butter, melted", amount: "85 g"},
              {name: "Granulated sugar",        amount: "200 g"},
              {name: "Macadamias (for milk)",   amount: "100 g"},
              {name: "Water",                   amount: "400 ml"},
              {name: "Vanilla extract",         amount: "1 tsp"},
              {name: "Dried figs",              amount: "topping"},
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
            SECCIÓN 3 — Pasos (frames 238–1308)
            ────────────────────────────────────────────────────── */}
        <Sequence from={PASOS_FROM} durationInFrames={PASOS_DUR}>
          <Audio src={PASOS_SRC} volume={1} />
        </Sequence>

        <Sequence from={S1_FROM} durationInFrames={S2_FROM - S1_FROM}>
          <StepCardPH stepNumber={1} stepDescription={"ADD LIQUIDS\nAND FLOURS"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S2_FROM} durationInFrames={S3_FROM - S2_FROM}>
          <StepCardPH stepNumber={2} stepDescription={"CUT THE\nNUTS"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>
        <Sequence from={S3_FROM} durationInFrames={S4_FROM - S3_FROM}>
          <StepCardPH stepNumber={3} stepDescription={"MIX NUTS\nINTO BATTER"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S4_FROM} durationInFrames={S5_FROM - S4_FROM}>
          <StepCardPH stepNumber={4} stepDescription={"POUR INTO\nSERVING DISH"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>
        <Sequence from={S5_FROM} durationInFrames={S6_FROM - S5_FROM}>
          <StepCardPH stepNumber={5} stepDescription={"MAKE MACADAMIA\nMILK"} corner="bottomRight" bottomOffset={120} />
        </Sequence>
        <Sequence from={S6_FROM} durationInFrames={S7_FROM - S6_FROM}>
          <StepCardPH stepNumber={6} stepDescription={"CARAMELIZE\nTHE TOP"} corner="bottomLeft" bottomOffset={120} />
        </Sequence>
        <Sequence from={S7_FROM} durationInFrames={OUTRO_FROM - S7_FROM}>
          <StepCardPH stepNumber={7} stepDescription={"TOP WITH\nDRIED FIGS"} corner="bottomRight" bottomOffset={120} />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            SECCIÓN 4 — Outro (frame 1308)
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
