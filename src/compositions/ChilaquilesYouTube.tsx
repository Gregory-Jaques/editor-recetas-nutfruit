import React from "react";
import {AbsoluteFill, Video, Audio, staticFile, Sequence, interpolate} from "remotion";
import {RecipeIntro} from "./nutfruit-recetas/RecipeIntro";
import {RecipeIngredientsScreen} from "./nutfruit-recetas/RecipeIngredientsScreen";
import {StepCard} from "./nutfruit-recetas/StepCard";
import {OutroText} from "./nutfruit-recetas/OutroText";

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

// Volúmenes — voces en primer plano, video y música de fondo
const VOL_VIDEO  = 0.15;
const VOL_MUSIC  = 0.10;
const VOL_WHOOSH = 0.35;

// ── Sections ────────────────────────────────────────────────────────────────
const CUT_FRAME     = 100;
const INGR_DUR      = 160;
const INGR_FROM     = CUT_FRAME;               // 100
const INGR_FADE_OUT = 135;
const VIDEO_RESUME  = INGR_FROM + INGR_FADE_OUT; // 235

const PASOS_FROM = INGR_FROM + INGR_DUR;       // 260
const PASOS_DUR  = 833;
const PASOS_END  = PASOS_FROM + PASOS_DUR;     // 1093

const OUTRO_FROM = 984;
const OUTRO_DUR  = 160;

const VIDEO_END  = 1106;                       // 44.22s × 25fps
const V2_DUR     = VIDEO_END - CUT_FRAME;      // 1006 — video completo desde CUT_FRAME
const V2_FADE_AT = V2_DUR - 50;               // 956 — fadeout 2s antes del final (local)
const TOTAL_DUR  = VIDEO_RESUME + V2_DUR;      // 1241

// ── StepCards ────────────────────────────────────────────────────────────────
const S1_FROM = PASOS_FROM;
const S1_DUR  = 150;
const S2_FROM = S1_FROM + S1_DUR;
const S2_DUR  = 130;
const S3_FROM = S2_FROM + S2_DUR;
const S3_DUR  = 130;
const S4_FROM = S3_FROM + S3_DUR;
const S4_DUR  = PASOS_END - S4_FROM;

export const ChilaquilesYouTube: React.FC = () => {
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
          VIDEO PARTE 2 — frames 235–1241 (completo)
          startFrom=100 → retoma desde donde se cortó
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
          SECCIÓN 1 — Intro (frames 0–100)
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={0} durationInFrames={CUT_FRAME}>
        <RecipeIntro
          line1="CHILAQUILES DE CIRUELA"
          line2="PASAS Y PISTACHOS"
          position="center"
        />
      </Sequence>
      <Sequence from={0} durationInFrames={CUT_FRAME}>
        <Audio src={staticFile("assets/nutfruit-recetas/receta1/intro.mp3")} />
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
          recipeName="CHILAQUILES"
          recipeVariant="CIRUELA PASAS Y PISTACHOS"
          servings="2 personas"
          time="45 min"
          fadeInDuration={8}
          fadeOutAt={INGR_FADE_OUT}
          ingredients={[
            {name: "Chiles guajillo",             amount: "6"},
            {name: "Ciruelas pasas",              amount: "4"},
            {name: "Cebolla",                     amount: "½"},
            {name: "Ajo",                         amount: "2 dientes"},
            {name: "Comino",                      amount: "½ cdta"},
            {name: "Sal",                         amount: "1 cdta"},
            {name: "Agua para licuar la salsa"},
            {name: "Tortillas de maíz",           amount: "6"},
            {name: "Aceite",                      amount: "1 taza"},
            {name: "Sal"},
            {name: "Pistachos",                   amount: "20g"},
            {name: "Piñones",                     amount: "20g"},
            {name: "Cebolla morada (picada)"},
            {name: "Queso cotija"},
            {name: "Aguacate",                    amount: "1"},
            {name: "Cilantro fresco"},
          ]}
        />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════
          WHOOSH salida — frame 235
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={VIDEO_RESUME} durationInFrames={39}>
        <Audio src={WHOOSH_OUT} volume={VOL_WHOOSH} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 3 — Pasos (frames 260–1093)
          ══════════════════════════════════════════════════════════ */}
      <Sequence from={PASOS_FROM} durationInFrames={PASOS_DUR}>
        <Audio src={staticFile("assets/nutfruit-recetas/receta1/pasos.mp3")} />
      </Sequence>

      <Sequence from={S1_FROM} durationInFrames={S1_DUR}>
        <StepCard stepNumber={1} stepDescription={"TUESTA\nJITOMATES Y GUAJILLO"} corner="bottomRight" />
      </Sequence>
      <Sequence from={S2_FROM} durationInFrames={S2_DUR}>
        <StepCard stepNumber={2} stepDescription={"LICÚA CON\nAJO Y SAL"} corner="bottomLeft" />
      </Sequence>
      <Sequence from={S3_FROM} durationInFrames={S3_DUR}>
        <StepCard stepNumber={3} stepDescription={"SOFRÍE Y AGREGA\nLOS TOTOPOS"} corner="bottomRight" />
      </Sequence>
      <Sequence from={S4_FROM} durationInFrames={S4_DUR}>
        <StepCard stepNumber={4} stepDescription={"CORTA Y SATEA\nLOS TOPPINGS"} corner="bottomLeft" />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 4 — Outro (frame 984)
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
