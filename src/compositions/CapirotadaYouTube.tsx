import React from "react";
import {AbsoluteFill, Video, Audio, staticFile, Sequence, interpolate} from "remotion";
import {RecipeIntro} from "./nutfruit-recetas/RecipeIntro";
import {RecipeIngredientsScreen} from "./nutfruit-recetas/RecipeIngredientsScreen";
import {StepCard} from "./nutfruit-recetas/StepCard";
import {OutroText} from "./nutfruit-recetas/OutroText";

// ── Timing constants (25 fps) ─────────────────────────────────────────────────
//  intro.mp3              →  5.49s = 137 frames
//  ingredientes.mp3       →  2.35s =  59 frames
//  pasos.mp3              → 35.79s = 895 frames (suena completo, frames 260–1155)
//  final.mp3              →  2.51s =  63 frames (entra con el outro en frame 1000)
//  musica video 3.mp3     → 60.03s = 1501 frames
//  whoosh-in/out.mp3      →  1.56s =   39 frames
//  capirotada_16x9.mp4    →   50s  = 1250 frames @ 25fps
//  (sin logo al final — ya está incrustado en el video)

const VIDEO_SRC   = staticFile("assets/nutfruit-recetas/receta3yt/capirotada_16x9.mp4");
const WHOOSH_IN   = staticFile("assets/nutfruit-recetas/receta3yt/whoosh-in.mp3");
const WHOOSH_OUT  = staticFile("assets/nutfruit-recetas/receta3yt/whoosh-out.mp3");
const MUSIC_BG    = staticFile("assets/nutfruit-recetas/receta3yt/musica video 3.mp3");
const INTRO_SRC   = staticFile("assets/nutfruit-recetas/receta3yt/intro.mp3");
const INGR_VOICE  = staticFile("assets/nutfruit-recetas/receta3yt/ingredientes.mp3");
const PASOS_SRC   = staticFile("assets/nutfruit-recetas/receta3yt/pasos.mp3");
const FINAL_SRC   = staticFile("assets/nutfruit-recetas/receta3yt/final.mp3");

// Volúmenes — voces en primer plano, video y música de fondo
const VOL_VIDEO  = 0.15;
const VOL_MUSIC  = 0.10;
const VOL_WHOOSH = 0.30;

// ── Sections ────────────────────────────────────────────────────────────────
const CUT_FRAME     = 100;
const INGR_DUR      = 160;
const INGR_FROM     = CUT_FRAME;               // 100
const INGR_FADE_OUT = 135;
const VIDEO_RESUME  = INGR_FROM + INGR_FADE_OUT; // 235

const PASOS_FROM = INGR_FROM + INGR_DUR;       // 260
const PASOS_DUR  = 895;                        // duración exacta de pasos.mp3 — suena completo

const PASOS_END  = PASOS_FROM + PASOS_DUR;     // 1155 — final.mp3 entra aquí
const OUTRO_FROM = 1165;
const OUTRO_DUR  = 160;

const VIDEO_TOTAL = 1250;
const V2_DUR      = VIDEO_TOTAL - CUT_FRAME;   // 1150 (video pos 100→1250, completo)
const V2_FADE_AT  = V2_DUR - 50;              // 1100 — fadeout 2s antes del final (local)
const TOTAL_DUR   = VIDEO_RESUME + V2_DUR;     // 235 + 1150 = 1385 frames

// ── StepCards — timings fijados por usuario ──────────────────────────────────
const S1_FROM = PASOS_FROM;  // 260
const S1_DUR  = 132;         // → 392
const S2_FROM = 392;         // ← fijado
const S2_DUR  = 246;         // → 638
const S3_FROM = S2_FROM + S2_DUR; // 638
const S3_DUR  = 245;         // → 883
const S4_FROM = 883;         // ← fijado
const S4_DUR  = 117;         // → 1000
const S5_FROM = 1000;        // ← fijado
const S5_DUR  = 74;          // → 1074

export const CapirotadaYouTube: React.FC = () => {
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
          VIDEO PARTE 2 — frames 235–1385 (completo, con logo incrustado)
          startFrom=100 → retoma donde se cortó
          Fadeout de volumen en los últimos 2s
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
          line1="CAPIROTADA MEXICANA"
          line2="DE FRUTOS SECOS"
          position="center"
        />
      </Sequence>
      <Sequence from={0} durationInFrames={137}>
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
          recipeName="CAPIROTADA"
          recipeVariant="MEXICANA DE FRUTOS SECOS"
          servings="4 personas"
          time="45 min"
          fadeInDuration={8}
          fadeOutAt={INGR_FADE_OUT}
          ingredients={[
            {name: "Pan francés"},
            {name: "Mantequilla"},
            {name: "Panela",               amount: "200g"},
            {name: "Canela",               amount: "1 rama"},
            {name: "Agua",                 amount: "300 ml"},
            {name: "Queso cotija",         amount: "70g"},
            {name: "Pasas",                amount: "30g"},
            {name: "Cacahuetes",           amount: "30g"},
            {name: "Higos secos",          amount: "8"},
            {name: "Nueces pecanas",       amount: "30g"},
            {name: "Plátano",              amount: "1"},
            {name: "Chispas decorativas",  amount: "4 cdas"},
            {name: "Coco rallado",         amount: "3 cdas"},
          ]}
        />
      </Sequence>
      {/* Voz ingredientes — 1s (25f) después del whoosh anterior = frame 150 */}
      <Sequence from={INGR_FROM + 50} durationInFrames={59}>
        <Audio src={INGR_VOICE} volume={1} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════
          WHOOSH salida — frame 235
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={VIDEO_RESUME} durationInFrames={39}>
        <Audio src={WHOOSH_OUT} volume={VOL_WHOOSH} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 3 — Pasos (frames 260–1155, audio completo)
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={PASOS_FROM} durationInFrames={PASOS_DUR}>
        <Audio src={PASOS_SRC} volume={1} />
      </Sequence>

      <Sequence from={S1_FROM} durationInFrames={S1_DUR}>
        <StepCard stepNumber={1} stepDescription={"TUESTA EL PAN\nCON MANTEQUILLA"} corner="bottomRight" />
      </Sequence>
      <Sequence from={S2_FROM} durationInFrames={S2_DUR}>
        <StepCard stepNumber={2} stepDescription={"PREPARA EL SIROPE\nDE PANELA"} corner="bottomLeft" />
      </Sequence>
      <Sequence from={S3_FROM} durationInFrames={S3_DUR}>
        <StepCard stepNumber={3} stepDescription={"MONTA LAS CAPAS\nEN LA BANDEJA"} corner="bottomRight" />
      </Sequence>
      <Sequence from={S4_FROM} durationInFrames={S4_DUR}>
        <StepCard stepNumber={4} stepDescription={"BAÑA CON\nEL SIROPE"} corner="bottomLeft" />
      </Sequence>
      <Sequence from={S5_FROM} durationInFrames={S5_DUR}>
        <StepCard stepNumber={5} stepDescription={"DEJA REPOSAR\nY SIRVE"} corner="bottomRight" />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 4 — Outro (frames 1000–1160) + voz final
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
      <Sequence from={PASOS_END} durationInFrames={63}>
        <Audio src={FINAL_SRC} volume={1} />
      </Sequence>

    </AbsoluteFill>
  );
};
