import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {ColorCtx, FONT_PH, FONT_PH_DISPLAY, usePHFonts, NRIcon} from "./shared";

export interface RecipeIngredientsScreenPHProps {
  recipeName?:      string;
  recipeVariant?:   string;
  ingredients?:     {name: string; amount?: string}[];
  servings?:        string;
  time?:            string;
  fadeInDuration?:  number;
  fadeOutAt?:       number;
}

const DEFAULTS: Required<RecipeIngredientsScreenPHProps> = {
  recipeName:     "CHILAQUILES",
  recipeVariant:  "CIRUELA PASAS & PISTACHIOS",
  ingredients:    [],
  servings:       "2 servings",
  time:           "45 min",
  fadeInDuration: 14,
  fadeOutAt:      120,
};

const T_BRAND   = 4;
const T_LINE    = 8;
const T_TITLE   = 12;
const T_VARIANT = 28;
const T_META    = 32;
const T_RULE    = 30;
const T_HEAD    = 36;
const T_FIRST   = 42;
const STAGGER   = 4;

export const RecipeIngredientsScreenPH: React.FC<RecipeIngredientsScreenPHProps> = (raw) => {
  const props = {...DEFAULTS, ...raw};
  const {recipeName, recipeVariant, ingredients, servings, time, fadeOutAt} = props;

  const frame                   = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {ready}                 = usePHFonts();
  const colors                  = React.useContext(ColorCtx);

  // ── Orb intensity — se apaga en fondos oscuros ────────────────────────────
  const hexLum = (hex: string) => {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return (0.299*r + 0.587*g + 0.114*b) / 255;
  };
  const glowMult = Math.max(0, Math.min(1, (hexLum(colors.dark) - 0.15) / 0.15));

  const n    = ingredients.length;
  const half = Math.ceil(n / 2);
  const col1 = ingredients.slice(0, half);
  const col2 = ingredients.slice(half);

  // ── Panel slide: entra desde la derecha, sale hacia la izquierda ─────────────
  const entryProg = spring({fps, frame, config: {damping: 22, stiffness: 220}, durationInFrames: 22});
  const entryX    = interpolate(entryProg, [0, 1], [105, 0]);

  const exitProg  = spring({fps, frame: frame - fadeOutAt, config: {damping: 22, stiffness: 220}, durationInFrames: 20});
  const exitX     = frame >= fadeOutAt ? interpolate(exitProg, [0, 1], [0, -105]) : 0;

  const panelX = entryX + exitX;

  // contentFade: para elementos internos que se anticipan al slide-out
  const contentFade = interpolate(frame, [fadeOutAt - 8, fadeOutAt + 4], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── Elementos en movimiento constante ────────────────────────────────────────

  // Orb flotante (figura 8 suave)
  const orbY  = Math.sin(frame * 0.055) * 28;
  const orbX  = Math.cos(frame * 0.038) * 18;

  // Segundo orb (contrapunto)
  const orb2Y = Math.sin(frame * 0.042 + 2.1) * 22;
  const orb2X = Math.cos(frame * 0.03 + 1.4) * 14;

  // Glow que respira — apagado en fondos oscuros
  const glowBreath  = (0.18 + Math.sin(frame * 0.07) * 0.06) * glowMult;

  // Watermark rota lento
  const watermarkRot = frame * 0.09;

  // ── Spring helper ─────────────────────────────────────────────────────────────
  const sp = (delay: number, d: number, s: number) =>
    spring({fps, frame: frame - delay, config: {damping: d, stiffness: s}, durationInFrames: 30});

  // Brand badge
  const brandOpa  = interpolate(frame, [T_BRAND, T_BRAND + 14], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const iconScale = interpolate(sp(T_BRAND, 12, 260), [0, 1], [0, 1]);

  // Línea accent bajo el título
  const lineScaleX = interpolate(sp(T_LINE, 22, 300), [0, 1], [0, 1]);

  // Título palabras
  const titleWords = recipeName.split(" ");

  // Variante: clip desde izquierda
  const variantOpa = interpolate(frame, [T_VARIANT, T_VARIANT + 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Metadata
  const metaOpa = interpolate(frame, [T_META, T_META + 14], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

  // Regla vertical
  const ruleScaleY = interpolate(sp(T_RULE, 20, 300), [0, 1], [0, 1]);

  // Header ingredientes
  const headOpa = interpolate(frame, [T_HEAD, T_HEAD + 14], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

  if (!ready) return <AbsoluteFill style={{background: colors.dark}} />;

  // ── Ingredient row ────────────────────────────────────────────────────────────
  const ingRow = (item: {name: string; amount?: string}, gi: number) => {
    const delay    = T_FIRST + gi * STAGGER;
    const rowProg  = sp(delay, 26, 280);
    const rowTY    = interpolate(rowProg, [0, 1], [16, 0]);
    const rowOpa   = interpolate(rowProg, [0, 0.25, 1], [0, 1, 1]);
    const amtScale = interpolate(sp(delay + 4, 14, 300), [0, 1], [0.5, 1]);
    const num      = String(gi + 1).padStart(2, "0");

    return (
      <div
        key={gi}
        style={{
          display:       "flex",
          alignItems:    "center",
          gap:           0,
          opacity:       rowOpa * contentFade,
          transform:     `translateY(${rowTY}px)`,
          paddingBottom: 13,
          marginBottom:  13,
          borderBottom:  "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <span style={{
          fontFamily:  `'${FONT_PH}', sans-serif`,
          fontWeight:  700,
          fontSize:    17,
          color:       "rgba(255,255,255,0.65)",
          letterSpacing: 0.5,
          width:       38,
          flexShrink:  0,
          lineHeight:  1,
        }}>
          {num}
        </span>

        <span style={{
          fontFamily: `'${FONT_PH}', sans-serif`,
          fontWeight: 600,
          fontSize:   34,
          color:      colors.white,
          flex:       1,
          lineHeight: 1.2,
        }}>
          {item.name}
        </span>

        {item.amount && (
          <span style={{
            flex:         "0 1 40px",
            height:       1,
            borderBottom: "1.5px dashed rgba(255,255,255,0.16)",
            marginLeft:   10,
            marginRight:  10,
            alignSelf:    "flex-end",
            marginBottom: 7,
          }} />
        )}

        {item.amount && (
          <div style={{
            transform:       `scale(${amtScale})`,
            transformOrigin: "right center",
            background:      colors.accent,
            borderRadius:    5,
            padding:         "4px 14px",
            flexShrink:      0,
            fontFamily:      `'${FONT_PH}', sans-serif`,
            fontWeight:      800,
            fontSize:        22,
            color:           colors.white,
            letterSpacing:   0.5,
          }}>
            {item.amount}
          </div>
        )}
      </div>
    );
  };

  return (
    // Contenedor externo: overflow hidden para que el slide funcione
    <AbsoluteFill style={{overflow: "hidden"}}>

      {/* ── Panel completo que desliza ── */}
      <AbsoluteFill style={{transform: `translateX(${panelX}%)`}}>

        {/* ── FONDO: color de marca por país ── */}
        <AbsoluteFill style={{background: colors.dark}} />
        <AbsoluteFill style={{
          background: `linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.10) 100%)`,
          pointerEvents: "none",
        }} />

        {/* ── Orb de luz blanca principal (movimiento constante) ── */}
        <div style={{
          position:      "absolute",
          left:          "10%",
          top:           "50%",
          transform:     `translate(${orbX}px, calc(-50% + ${orbY}px))`,
          width:         560,
          height:        560,
          borderRadius:  "50%",
          background:    `radial-gradient(circle, rgba(255,255,255,${(glowBreath * 0.55).toFixed(2)}) 0%, transparent 65%)`,
          pointerEvents: "none",
        }} />

        {/* ── Orb secundario contrapunto ── */}
        <div style={{
          position:      "absolute",
          right:         "10%",
          bottom:        "18%",
          transform:     `translate(${orb2X}px, ${orb2Y}px)`,
          width:         320,
          height:        320,
          borderRadius:  "50%",
          background:    `radial-gradient(circle, rgba(255,255,255,${(0.18 * glowMult).toFixed(2)}) 0%, transparent 65%)`,
          pointerEvents: "none",
        }} />

        {/* ── Textura dot-grid blanca ── */}
        <AbsoluteFill style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)`,
          backgroundSize:  "52px 52px",
          pointerEvents:   "none",
        }} />

        {/* ── Barra accent superior ── */}
        <div style={{
          position:   "absolute",
          left: 0, top: 0, right: 0,
          height:     5,
          background: colors.accent,
          opacity:    contentFade,
        }} />

        {/* ── Watermark rotando lento ── */}
        <div style={{
          position:   "absolute",
          right:      56,
          top:        44,
          opacity:    0.045,
          transform:  `rotate(${watermarkRot}deg)`,
          transformOrigin: "center center",
          pointerEvents: "none",
        }}>
          <NRIcon size={340} color={colors.white} />
        </div>

        {/* ── Layout principal ── */}
        <div style={{
          position: "absolute", inset: 0,
          display:  "flex", alignItems: "center",
          padding:  "0 108px 80px", gap: 60,
        }}>

          {/* ── IZQUIERDA: identidad ── */}
          <div style={{
            flex:          "0 0 500px",
            display:       "flex",
            flexDirection: "column",
            alignItems:    "flex-start",
            opacity:       contentFade,
          }}>

            {/* Brand badge */}
            <div style={{
              display:      "flex",
              alignItems:   "center",
              gap:          14,
              marginBottom: 38,
              opacity:      brandOpa,
            }}>
              <div style={{transform: `scale(${iconScale})`, transformOrigin: "center"}}>
                <NRIcon size={30} color={colors.accent} />
              </div>
              <span style={{
                fontFamily:    `'${FONT_PH}', sans-serif`,
                fontWeight:    700,
                fontSize:      18,
                color:         "rgba(255,255,255,0.45)",
                letterSpacing: 6,
                textTransform: "uppercase" as const,
              }}>
                Nutfruit Recipes
              </span>
            </div>

            {/* Nombre receta — clip por palabra */}
            {titleWords.map((word, i) => {
              const prog = sp(T_TITLE + i * 5, 26, 300);
              const ty   = interpolate(prog, [0, 1], [105, 0]);
              return (
                <div key={i} style={{overflow: "hidden", height: 106, lineHeight: 1, marginBottom: 2}}>
                  <div style={{
                    transform:     `translateY(${ty}%)`,
                    fontFamily:    `'${FONT_PH_DISPLAY}', sans-serif`,
                    fontWeight:    900,
                    fontSize:      100,
                    color:         colors.white,
                    letterSpacing: -1,
                    lineHeight:    1,
                    textTransform: "uppercase" as const,
                  }}>
                    {word}
                  </div>
                </div>
              );
            })}

            {/* Línea blanca que se dibuja bajo el título */}
            <div style={{
              height:       4,
              width:        `${lineScaleX * 100}%`,
              background:   `linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.3))`,
              borderRadius: 2,
              marginTop:    10,
              marginBottom: 18,
            }} />

            {/* Variante — fade in */}
            <div style={{
              opacity:       variantOpa,
              marginBottom:  28,
              fontFamily:    `'${FONT_PH}', sans-serif`,
              fontWeight:    800,
              fontSize:      40,
              color:         "rgba(255,255,255,0.85)",
              letterSpacing: 2,
              textTransform: "uppercase" as const,
              lineHeight:    1.2,
              whiteSpace:    "nowrap",
            }}>
              {recipeVariant}
            </div>

            {/* Metadata */}
            <div style={{opacity: metaOpa}}>
              <span style={{
                fontFamily:    `'${FONT_PH}', sans-serif`,
                fontWeight:    500,
                fontSize:      21,
                color:         "rgba(255,255,255,0.38)",
                letterSpacing: 4,
                textTransform: "uppercase" as const,
              }}>
                {servings}&nbsp;&nbsp;·&nbsp;&nbsp;{time}
              </span>
            </div>
          </div>

          {/* ── CENTRO: regla con glow ── */}
          <div style={{
            width:           2,
            height:          500,
            flexShrink:      0,
            background:      `linear-gradient(to bottom, transparent, rgba(255,255,255,0.7) 12%, rgba(255,255,255,0.7) 88%, transparent)`,
            boxShadow:       `0 0 14px rgba(255,255,255,0.5)`,
            transformOrigin: "top center",
            transform:       `scaleY(${ruleScaleY})`,
            opacity:         contentFade,
          }} />

          {/* ── DERECHA: ingredientes ── */}
          <div style={{flex: 1, display: "flex", flexDirection: "column"}}>

            <div style={{
              fontFamily:    `'${FONT_PH}', sans-serif`,
              fontWeight:    800,
              fontSize:      22,
              color:         "rgba(255,255,255,0.75)",
              letterSpacing: 8,
              textTransform: "uppercase" as const,
              marginBottom:  28,
              opacity:       headOpa * contentFade,
            }}>
              INGREDIENTS
            </div>

            <div style={{display: "flex", gap: 44}}>
              <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
                {col1.map((item, ii) => ingRow(item, ii))}
              </div>
              {col2.length > 0 && (
                <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
                  {col2.map((item, ii) => ingRow(item, half + ii))}
                </div>
              )}
            </div>
          </div>

        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
