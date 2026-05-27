import React from "react";
import {AbsoluteFill, Video, Audio, staticFile, Sequence, interpolate} from "remotion";
import {RecipeIntro} from "./nutfruit-recetas/RecipeIntro";
import {RecipeIngredientsScreen} from "./nutfruit-recetas/RecipeIngredientsScreen";
import {StepCard} from "./nutfruit-recetas/StepCard";
import {OutroText} from "./nutfruit-recetas/OutroText";

// ── Timing constants (25 fps) ─────────────────────────────────────────────────
//  intro.mp3              →  4.60s =  115 frames
//  ingredientes.mp3       →  1.31s =   33 frames
//  pasos.mp3              → 46.18s = 1155 frames
//  musica fondo.mp3       →159.35s = 3984 frames (cubre todo el video)
//  whoosh-in/out.mp3      →  1.56s =   39 frames
//  flautas_16x9.mp4       → 57.47s = 1437 frames @ 25fps
//  logo final videos.mp4  →  2.47s =   62 frames

const VIDEO_SRC     = staticFile("assets/nutfruit-recetas/receta2yt/flautas_16x9.mp4");
const WHOOSH_IN     = staticFile("assets/nutfruit-recetas/receta2yt/whoosh-in.mp3");
const WHOOSH_OUT    = staticFile("assets/nutfruit-recetas/receta2yt/whoosh-out.mp3");
const INTRO_SRC     = staticFile("assets/nutfruit-recetas/receta2yt/intro.mp3");
const INGR_VOICE    = staticFile("assets/nutfruit-recetas/receta2yt/ingredientes.mp3");
const PASOS_SRC     = staticFile("assets/nutfruit-recetas/receta2yt/pasos.mp3");
const MUSIC_BG      = staticFile("assets/nutfruit-recetas/receta2yt/musica fondo.mp3");

// Volúmenes — voz en primer plano, video y música de fondo
const VOL_VIDEO  = 0.15;  // video de cocina muy bajo, voz es protagonista
const VOL_MUSIC  = 0.10;  // música de fondo suave durante todo el video
const VOL_WHOOSH = 0.30;  // whoosh suave
// Voces siempre a 1.0 para máxima claridad

// ── Sections ────────────────────────────────────────────────────────────────
const CUT_FRAME     = 100;   // video se corta aquí
const INGR_DUR      = 160;   // duración pantalla de ingredientes
const INGR_FROM     = CUT_FRAME;               // 100
const INGR_FADE_OUT = 135;   // relativo — empieza fade-out 25f antes del final
const VIDEO_RESUME  = INGR_FROM + INGR_FADE_OUT; // 235

const PASOS_FROM = INGR_FROM + INGR_DUR;       // 260
const PASOS_DUR  = 1155;                        // duración exacta de pasos.mp3
const PASOS_END  = PASOS_FROM + PASOS_DUR;     // 1415

const OUTRO_FROM = 1254;
const OUTRO_DUR  = 87;   // 1341 - 1254

const VIDEO_END  = 1437;
const V2_DUR     = VIDEO_END - CUT_FRAME;     // 1337 — video completo desde CUT_FRAME
const V2_FADE_AT = V2_DUR - 50;              // 1287 — fadeout 2s antes del final

const TOTAL_DUR  = VIDEO_RESUME + V2_DUR;    // 1572 frames

// ── StepCards ───────────────────────────────────────────────────────────────
// S1 + S2 cubren frames 260–744 | S3 empieza en 744 (fijado)
// S3 + S4 + S5 cubren frames 744–1199
const S1_FROM = PASOS_FROM;         // 260
const S1_DUR  = 242;
const S2_FROM = S1_FROM + S1_DUR;   // 502
const S2_DUR  = 242;
const S3_FROM = S2_FROM + S2_DUR;   // 744 ← fijado por usuario
const S3_DUR  = 152;
const S4_FROM = S3_FROM + S3_DUR;   // 896
const S4_DUR  = 152;
const S5_FROM = S4_FROM + S4_DUR;   // 1048
const S5_DUR  = PASOS_END - S5_FROM; // 151

export const FlautasYouTube: React.FC = () => {
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
          VIDEO PARTE 1 — frames 0–100 (volumen bajo)
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
          VIDEO PARTE 2 — frame 235 al 1437
          startFrom=100 → retoma desde donde se cortó
          Fadeout de volumen en los últimos 2s (50 frames)
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
          line1="VEGGIE FLAUTAS"
          line2="CON ARÁNDANOS SECOS"
          position="center"
        />
      </Sequence>
      <Sequence from={0} durationInFrames={115}>
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
          Voz en off de ingredientes, sin música de fondo propia
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={INGR_FROM} durationInFrames={INGR_DUR}>
        <RecipeIngredientsScreen
          recipeName="VEGGIE FLAUTAS"
          recipeVariant="CON ARÁNDANOS SECOS"
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
      {/* Voz en off de ingredientes — empieza 25f después del whoosh */}
      <Sequence from={INGR_FROM + 25} durationInFrames={33}>
        <Audio src={INGR_VOICE} volume={1} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════
          WHOOSH salida — frame 235
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={VIDEO_RESUME} durationInFrames={39}>
        <Audio src={WHOOSH_OUT} volume={VOL_WHOOSH} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 3 — Pasos (frames 260–1388, audio completo)
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={PASOS_FROM} durationInFrames={PASOS_DUR}>
        <Audio src={PASOS_SRC} volume={1} />
      </Sequence>

      <Sequence from={S1_FROM} durationInFrames={S1_DUR}>
        <StepCard stepNumber={1} stepDescription={"SOFRÍE CEBOLLA,\nPIMIENTO Y AJO"} corner="bottomRight" />
      </Sequence>
      <Sequence from={S2_FROM} durationInFrames={S2_DUR}>
        <StepCard stepNumber={2} stepDescription={"AÑADE CHAMPIÑONES\nY LENTEJAS"} corner="bottomLeft" />
      </Sequence>
      <Sequence from={S3_FROM} durationInFrames={S3_DUR}>
        <StepCard stepNumber={3} stepDescription={"RELLENA Y ENROLLA\nLAS TORTILLAS"} corner="bottomRight" />
      </Sequence>
      <Sequence from={S4_FROM} durationInFrames={S4_DUR}>
        <StepCard stepNumber={4} stepDescription={"FREÍ A 180°\nHASTA DORAR"} corner="bottomLeft" />
      </Sequence>
      <Sequence from={S5_FROM} durationInFrames={S5_DUR}>
        <StepCard stepNumber={5} stepDescription={"DECORA CON AGUACATE\nY PICO DE GALLO"} corner="bottomRight" />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 4 — Outro (frames 1254–1341)
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
