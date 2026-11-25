import React from "react";
import {AbsoluteFill, Video, Audio, staticFile, Sequence, interpolate} from "remotion";
import {RecipeIntroPH} from "./nutfruit-recetas/RecipeIntroPH";
import {RecipeIngredientsScreenPH} from "./nutfruit-recetas/RecipeIngredientsScreenPH";
import {StepCardPH} from "./nutfruit-recetas/StepCardPH";
import {OutroTextPH} from "./nutfruit-recetas/OutroTextPH";
import {CountryTheme} from "./nutfruit-recetas/shared";

// ── Timing constants (25 fps) ─────────────────────────────────────────────────
//  intro.mp3              → 3.40s  =  85 frames
//  pasos.mp3              → 33.31s = 833 frames
//  whoosh-in/out.mp3      → 1.56s  =  39 frames
//  Chilaquiles_16x9.mp4   → 44.22s = 1106 frames
// TOTAL = 1241 frames (Root.tsx)

const VIDEO_SRC  = staticFile("assets/nutfruit-recetas/receta1/Chilaquiles_16x9.mp4");
const WHOOSH_IN  = staticFile("assets/nutfruit-recetas/receta1/whoosh-in.mp3");
const WHOOSH_OUT = staticFile("assets/nutfruit-recetas/receta1/whoosh-out.mp3");
const MUSIC_BG   = staticFile("assets/nutfruit-recetas/receta1/musica video 1.mp3");

const VOL_VIDEO  = 0.15;
const VOL_MUSIC  = 0.10;
const VOL_WHOOSH = 0.35;

// ── Sections ────────────────────────────────────────────────────────────────
const CUT_FRAME     = 78;
const INGR_DUR      = 160;
const INGR_FROM     = CUT_FRAME;                  // 100
const INGR_FADE_OUT = 135;
const VIDEO_RESUME  = INGR_FROM + INGR_FADE_OUT;  // 235

const PASOS_FROM = INGR_FROM + INGR_DUR;          // 260
const PASOS_DUR  = 833;
const PASOS_END  = PASOS_FROM + PASOS_DUR;        // 1093

const OUTRO_FROM = 984;
const OUTRO_DUR  = 160;

const VIDEO_TOTAL = 1106;                         // 44.22s × 25fps
const V2_DUR      = VIDEO_TOTAL - CUT_FRAME;      // 1006 — fórmula crítica
const V2_FADE_AT  = V2_DUR - 50;                  // 956
const TOTAL_DUR   = VIDEO_RESUME + V2_DUR;        // 1241

// ── StepCardPHs ────────────────────────────────────────────────────────────────
const S1_FROM = PASOS_FROM;
const S1_DUR  = 150;
const S2_FROM = S1_FROM + S1_DUR;
const S2_DUR  = 130;
const S3_FROM = S2_FROM + S2_DUR;
const S3_DUR  = 130;
const S4_FROM = S3_FROM + S3_DUR;
const S4_DUR  = PASOS_END - S4_FROM;

export const ChilaquilesLATAMYouTube: React.FC = () => {
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
          VIDEO PARTE 1 — frames 0–122 (se extiende 22f extra para
          que el video siga visible mientras el panel entra desde derecha)
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
          VIDEO PARTE 2 — frame 235 en adelante (retoma desde CUT_FRAME)
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
          TEMA LATAM — envuelve todos los componentes visuales de marca
          accent: #f3b212 (amarillo)  |  dark: #0033a0 (azul)
          ══════════════════════════════════════════════════════════ */}
      <CountryTheme country="filipinas">

        {/* ──────────────────────────────────────────────────────
            SECCIÓN 1 — Intro (frames 0–100)
            ────────────────────────────────────────────────────── */}
        <Sequence from={0} durationInFrames={CUT_FRAME + 25}>
          <RecipeIntroPH
            line1="CHILAQUILES"
            line2="CIRUELA PASAS & PISTACHIOS"
            position="center"
          />
        </Sequence>
        <Sequence from={0} durationInFrames={85}>
          <Audio src={staticFile("assets/nutfruit-recetas/receta1/intro.mp3")} />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            WHOOSH entrada — frame 100
            ────────────────────────────────────────────────────── */}
        <Sequence from={INGR_FROM} durationInFrames={39}>
          <Audio src={WHOOSH_IN} volume={VOL_WHOOSH} />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            SECCIÓN 2 — Ingredientes (frames 100–260)
            ────────────────────────────────────────────────────── */}
        <Sequence from={INGR_FROM} durationInFrames={INGR_DUR}>
          <RecipeIngredientsScreenPH
            recipeName="CHILAQUILES"
            recipeVariant="CIRUELA PASAS & PISTACHIOS"
            servings="2 servings"
            time="45 min"
            fadeInDuration={8}
            fadeOutAt={INGR_FADE_OUT}
            ingredients={[
              {name: "Guajillo chiles",             amount: "6"},
              {name: "Prunes",                      amount: "4"},
              {name: "Onion",                       amount: "½"},
              {name: "Garlic cloves",               amount: "2"},
              {name: "Cumin",                       amount: "½ tsp"},
              {name: "Salt",                        amount: "1 tsp"},
              {name: "Water for the salsa"},
              {name: "Corn tortillas",              amount: "6"},
              {name: "Oil",                         amount: "1 cup"},
              {name: "Salt"},
              {name: "Pistachios",                  amount: "20g"},
              {name: "Pine nuts",                   amount: "20g"},
              {name: "Red onion (diced)"},
              {name: "Cotija cheese"},
              {name: "Avocado",                     amount: "1"},
              {name: "Fresh cilantro"},
            ]}
          />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            WHOOSH salida — frame 235
            ────────────────────────────────────────────────────── */}
        <Sequence from={VIDEO_RESUME} durationInFrames={39}>
          <Audio src={WHOOSH_OUT} volume={VOL_WHOOSH} />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            SECCIÓN 3 — Pasos (frames 260–1093)
            ────────────────────────────────────────────────────── */}
        <Sequence from={PASOS_FROM} durationInFrames={PASOS_DUR}>
          <Audio src={staticFile("assets/nutfruit-recetas/receta1/pasos.mp3")} />
        </Sequence>

        <Sequence from={S1_FROM} durationInFrames={S1_DUR}>
          <StepCardPH stepNumber={1} stepDescription={"MAKE THE\nSALSA"} corner="bottomRight" />
        </Sequence>
        <Sequence from={S2_FROM} durationInFrames={S2_DUR}>
          <StepCardPH stepNumber={2} stepDescription={"FRY THE\nTORTILLAS"} corner="bottomLeft" />
        </Sequence>
        <Sequence from={S3_FROM} durationInFrames={S3_DUR}>
          <StepCardPH stepNumber={3} stepDescription={"COAT WITH\nRED SALSA"} corner="bottomRight" />
        </Sequence>
        <Sequence from={S4_FROM} durationInFrames={S4_DUR}>
          <StepCardPH stepNumber={4} stepDescription={"ADD YOUR\nTOPPINGS"} corner="bottomLeft" />
        </Sequence>

        {/* ──────────────────────────────────────────────────────
            SECCIÓN 4 — Outro (frame 984)
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
