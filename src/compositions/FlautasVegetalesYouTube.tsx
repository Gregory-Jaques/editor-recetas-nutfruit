import React from "react";
import {AbsoluteFill, Video, Audio, staticFile, Sequence, interpolate} from "remotion";
import {RecipeIntro} from "./nutfruit-recetas/RecipeIntro";
import {RecipeIngredientsScreen} from "./nutfruit-recetas/RecipeIngredientsScreen";
import {StepCard} from "./nutfruit-recetas/StepCard";
import {OutroText} from "./nutfruit-recetas/OutroText";

// ── Timing constants (25 fps) ─────────────────────────────────────────────────
//  intro.mp3          →  4.60s = 115 frames
//  ingredientes.mp3   →  1.31s =  33 frames
//  pasos.mp3          → 46.18s = 1155 frames
//  musica fondo.mp3   →159.58s = 3990 frames (cubre todo el video)
//  whoosh-in/out.mp3  →  1.56s =   39 frames
//  flautas_16x9.mp4   → 57.40s = 1435 frames @ 25fps

const VIDEO_SRC  = staticFile("assets/nutfruit-recetas/receta-test/flautas_16x9.mp4");
const WHOOSH_IN  = staticFile("assets/nutfruit-recetas/receta-test/whoosh-in.mp3");
const WHOOSH_OUT = staticFile("assets/nutfruit-recetas/receta-test/whoosh-out.mp3");
const MUSIC_BG   = staticFile("assets/nutfruit-recetas/receta-test/musica fondo.mp3");
const INTRO_SRC  = staticFile("assets/nutfruit-recetas/receta-test/intro.mp3");
const INGR_VOICE = staticFile("assets/nutfruit-recetas/receta-test/ingredientes.mp3");
const PASOS_SRC  = staticFile("assets/nutfruit-recetas/receta-test/pasos.mp3");

const VOL_VIDEO  = 0.15;
const VOL_MUSIC  = 0.10;
const VOL_WHOOSH = 0.30;

// ── Sections ────────────────────────────────────────────────────────────────
const CUT_FRAME     = 100;
const INGR_DUR      = 160;
const INGR_FROM     = CUT_FRAME;                   // 100
const INGR_FADE_OUT = 135;
const VIDEO_RESUME  = INGR_FROM + INGR_FADE_OUT;   // 235
const PASOS_FROM    = INGR_FROM + INGR_DUR;         // 260

// ── Audio ───────────────────────────────────────────────────────────────────
const INTRO_DUR      = 115;
const INGR_VOICE_DUR = 33;
const PASOS_DUR      = 1155;
const PASOS_END      = PASOS_FROM + PASOS_DUR;      // 1415

// ── StepCards ────────────────────────────────────────────────────────────────
// frame composición = segundo_video × 25 + 135
const S1_FROM = PASOS_FROM;                   // 5s  → 260
const S2_FROM = 310;                           // 7s  → 310
const S3_FROM = 460;                           // 13s → 460
const S4_FROM = 785;                           // 26s → 785
const S5_FROM = 885;                           // 30s → 885
const S6_FROM = 1110;                          // 39s → 1110
const OUTRO_FROM = 1360;                       // 49s → 1360

const S1_DUR = S2_FROM - S1_FROM;             // 50
const S2_DUR = S3_FROM - S2_FROM;             // 150
const S3_DUR = S4_FROM - S3_FROM;             // 325
const S4_DUR = S5_FROM - S4_FROM;             // 100
const S5_DUR = S6_FROM - S5_FROM;             // 225
const S6_DUR = OUTRO_FROM - S6_FROM;          // 250

const OUTRO_DUR  = 210;

const VIDEO_TOTAL = 1435;
const V2_DUR      = VIDEO_TOTAL - CUT_FRAME;  // 1335 ← fórmula crítica
const V2_FADE_AT  = V2_DUR - 50;              // 1285
const TOTAL_DUR   = VIDEO_RESUME + V2_DUR;    // 1570

export const FlautasVegetalesYouTube: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>

      {/* ══════════════════════════════════════════════════════════
          MÚSICA DE FONDO — toda la composición con fadeout al final
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
          SECCIÓN 1 — Intro (frames 0–100) + voz en off (115f, desborda CUT)
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={0} durationInFrames={CUT_FRAME}>
        <RecipeIntro
          line1="FLAUTAS VEGETALES"
          line2="CON LENTEJAS Y NUECES"
          position="center"
        />
      </Sequence>
      <Sequence from={0} durationInFrames={INTRO_DUR}>
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
          recipeName="FLAUTAS VEGETALES"
          recipeVariant="CON LENTEJAS Y NUECES"
          servings="2 personas"
          time="45 min"
          fadeInDuration={8}
          fadeOutAt={INGR_FADE_OUT}
          ingredients={[
            {name: "Nueces",                  amount: "40g"},
            {name: "Aceite de oliva",          amount: "2 cdas"},
            {name: "Cebolla (picada)",         amount: "1"},
            {name: "Pimiento rojo (picado)",   amount: "½"},
            {name: "Ajo (picado)",             amount: "1 diente"},
            {name: "Champiñones",              amount: "200g"},
            {name: "Lentejas",                 amount: "250g"},
            {name: "Comino",                   amount: "1 cdta"},
            {name: "Pimentón",                 amount: "1 cdta"},
            {name: "Orégano",                  amount: "1 cdta"},
            {name: "Sal y pimienta negra"},
            {name: "Tortillas de maíz",        amount: "8"},
            {name: "Aceite vegetal para freír"},
            {name: "Aguacate",                 amount: "1"},
            {name: "Arándanos secos",          amount: "20g"},
            {name: "Crema agria",              amount: "2 cdas"},
          ]}
        />
      </Sequence>
      <Sequence from={INGR_FROM + 25} durationInFrames={INGR_VOICE_DUR}>
        <Audio src={INGR_VOICE} volume={1} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════
          WHOOSH salida — frame 235
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={VIDEO_RESUME} durationInFrames={39}>
        <Audio src={WHOOSH_OUT} volume={VOL_WHOOSH} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 3 — Pasos: audio único + tarjetas visuales
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={PASOS_FROM} durationInFrames={PASOS_DUR}>
        <Audio src={PASOS_SRC} volume={1} />
      </Sequence>

      <Sequence from={S1_FROM} durationInFrames={S1_DUR}>
        <StepCard stepNumber={1} stepDescription={"PICA LOS\nINGREDIENTES"} corner="bottomRight" />
      </Sequence>
      <Sequence from={S2_FROM} durationInFrames={S2_DUR}>
        <StepCard stepNumber={2} stepDescription={"SOFRÍE\nLAS VERDURAS"} corner="bottomLeft" />
      </Sequence>
      <Sequence from={S3_FROM} durationInFrames={S3_DUR}>
        <StepCard stepNumber={3} stepDescription={"AÑADE CHAMPIÑONES\nY NUECES"} corner="bottomRight" />
      </Sequence>
      <Sequence from={S4_FROM} durationInFrames={S4_DUR}>
        <StepCard stepNumber={4} stepDescription={"RELLENA\nLAS TORTILLAS"} corner="bottomLeft" />
      </Sequence>
      <Sequence from={S5_FROM} durationInFrames={S5_DUR}>
        <StepCard stepNumber={5} stepDescription={"FRÍE\nLAS FLAUTAS"} corner="bottomRight" />
      </Sequence>
      <Sequence from={S6_FROM} durationInFrames={S6_DUR}>
        <StepCard stepNumber={6} stepDescription={"DECORA\nY SIRVE"} corner="bottomLeft" />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 4 — Outro (frame 1360 → fin)
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

    </AbsoluteFill>
  );
};
