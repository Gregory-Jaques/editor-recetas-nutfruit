import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {ColorCtx, FONT_PH, FONT_PH_DISPLAY, usePHFonts, NRIcon} from "./shared";

export interface RecipeIntroPHProps {
  line1?:    string;   // nombre de la receta (e.g. "CHILAQUILES")
  line2?:    string;   // subtítulo / variante (e.g. "CIRUELA PASAS & PISTACHIOS")
  position?: "top" | "center" | "bottom"; // mantenido por compatibilidad de API
}

const DEFAULT: Required<RecipeIntroPHProps> = {
  line1:    "CHILAQUILES",
  line2:    "CIRUELA PASAS & PISTACHIOS",
  position: "center",
};

// ── Scallop ────────────────────────────────────────────────────────────────────
// R  = radio de cada semicírculo (altura que protruye sobre el panel)
// W  = ancho total del panel (1920px)
// La cantidad de scallops es W / (R*2) → 24 scallops perfectos con R=40
const SCALLOP_R = 40;
const PANEL_W   = 1920;

/** Genera el path SVG de los semicírculos que definen el borde superior del panel */
const buildScallopPath = (W: number, R: number): string => {
  const D = R * 2;                       // diámetro de cada semicírculo
  const n = Math.round(W / D);           // cantidad de semicírculos
  let d   = `M 0,${R}`;
  for (let i = 0; i < n; i++) {
    // sweep-flag=1 → arco clockwise → protrude hacia ARRIBA (y decrece)
    d += ` A ${R},${R} 0 0,1 ${(i + 1) * D},${R}`;
  }
  // Cierra la forma hacia abajo para rellenar el rectángulo bajo los arcos
  d += ` L ${W},${R * 2} L 0,${R * 2} Z`;
  return d;
};

const SCALLOP_PATH = buildScallopPath(PANEL_W, SCALLOP_R);

// ── Timing ────────────────────────────────────────────────────────────────────
const T_PANEL    = 0;   // panel sube
const T_LABEL    = 14;  // "Nutfruit Recetas" aparece
const T_TITLE    = 20;  // palabras del título clipean hacia arriba
const T_SUBTITLE = 34;  // subtítulo clipea desde la izquierda

export const RecipeIntroPH: React.FC<RecipeIntroPHProps> = (raw) => {
  const props   = {...DEFAULT, ...raw};
  const {line1, line2} = props;
  const frame   = useCurrentFrame();
  const {fps}   = useVideoConfig();
  const {ready} = usePHFonts();
  const colors  = React.useContext(ColorCtx);

  // ── Panel: entra desde abajo ──────────────────────────────────────────────
  const panelIn = spring({fps, frame: frame - T_PANEL,
    config: {damping: 30, stiffness: 160}});
  const panelY  = interpolate(panelIn, [0, 1], [100, 0]);

  // ── Label + icon ───────────────────────────────────────────────────────────
  const labelOpa  = interpolate(frame, [T_LABEL, T_LABEL + 14], [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const iconProg  = spring({fps, frame: frame - T_LABEL,
    config: {damping: 18, stiffness: 280}});
  const iconScale = interpolate(iconProg, [0, 1], [0, 1]);

  // ── Orb intensity ──────────────────────────────────────────────────────────
  const hexLum = (hex: string) => {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return (0.299*r + 0.587*g + 0.114*b) / 255;
  };
  const glowMult = Math.max(0, Math.min(1, (hexLum(colors.dark) - 0.15) / 0.15));

  // ── Movimiento constante ───────────────────────────────────────────────────
  const glowBreath   = (0.22 + Math.sin(frame * 0.072) * 0.07) * glowMult;
  const orb2X        = Math.cos(frame * 0.038 + 1.2) * 14;
  const orb2Y        = Math.sin(frame * 0.052 + 0.8) * 20;
  const watermarkRot = frame * 0.06;

  // ── Título — palabras clipean hacia arriba ─────────────────────────────────
  const titleWords = line1.split(" ");

  // ── Subtítulo — solo fade in ───────────────────────────────────────────────
  const subOpa = interpolate(frame, [T_SUBTITLE, T_SUBTITLE + 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  if (!ready) return <AbsoluteFill style={{background: "transparent"}} />;

  return (
    <AbsoluteFill style={{background: "transparent", overflow: "hidden"}}>

      {/* ── Watermark flotando sobre el video ── */}
      <div style={{
        position:        "absolute",
        right:           60,
        top:             44,
        opacity:         0.05,
        transform:       `rotate(${watermarkRot}deg)`,
        transformOrigin: "center",
        pointerEvents:   "none",
      }}>
        <NRIcon size={220} color="#ffffff" />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          CAPA EXTERIOR — maneja el translateY del panel completo
          Sin overflow:hidden para que el SVG de scallops protruya hacia arriba
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        position:  "absolute",
        left:      0,
        right:     0,
        bottom:    0,
        height:    360,
        transform: `translateY(${panelY}%)`,
      }}>

        {/* ── SVG Scallops — borde superior del panel con semicírculos ──────
            top: -SCALLOP_R  → la mitad superior de los arcos protruye sobre el panel
            height: SCALLOP_R * 2 → R px arriba (arcos) + R px abajo (solapa con panel)
            Fill: colors.accent (naranja) → corona de color sobre el gradiente azul    */}
        <svg
          style={{
            position:    "absolute",
            top:         -SCALLOP_R,
            left:        0,
            width:       "100%",
            height:      SCALLOP_R * 2,
            display:     "block",
            pointerEvents: "none",
          }}
          viewBox={`0 0 ${PANEL_W} ${SCALLOP_R * 2}`}
          preserveAspectRatio="none"
        >
          <path d={SCALLOP_PATH} fill={colors.dark} />
        </svg>

        {/* ── PANEL INTERIOR — color de marca por país ── */}
        <div style={{
          position:   "absolute",
          inset:      0,
          background: colors.dark,
          overflow:   "hidden",
        }}>

          {/* Textura dot-grid */}
          <div style={{
            position:        "absolute", inset: 0,
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.14) 1px, transparent 0)`,
            backgroundSize:  "44px 44px",
            pointerEvents:   "none",
          }} />

          {/* Glow principal que respira */}
          <div style={{
            position:      "absolute",
            left:          "28%",
            top:           "55%",
            transform:     "translate(-50%, -50%)",
            width:         700,
            height:        700,
            borderRadius:  "50%",
            background:    `radial-gradient(circle, rgba(255,255,255,${glowBreath.toFixed(2)}) 0%, transparent 65%)`,
            pointerEvents: "none",
          }} />

          {/* Orb secundario en movimiento constante */}
          <div style={{
            position:      "absolute",
            right:         "8%",
            top:           "35%",
            transform:     `translate(${orb2X}px, ${orb2Y}px)`,
            width:         300,
            height:        300,
            borderRadius:  "50%",
            background:    `radial-gradient(circle, rgba(255,255,255,${(0.16 * glowMult).toFixed(2)}) 0%, transparent 65%)`,
            pointerEvents: "none",
          }} />

          {/* Watermark NRIcon interior (faint, contra-rotación) */}
          <div style={{
            position:        "absolute",
            right:           56,
            bottom:          30,
            opacity:         0.065,
            transform:       `rotate(${-watermarkRot * 0.4}deg)`,
            transformOrigin: "center",
            pointerEvents:   "none",
          }}>
            <NRIcon size={280} color="#ffffff" />
          </div>

          {/* ── Contenido ── */}
          <div style={{
            position:       "absolute", inset: 0,
            display:        "flex",
            flexDirection:  "column",
            justifyContent: "center",
            padding:        "0 108px",
          }}>

            {/* Brand label + icono */}
            <div style={{
              display:      "flex",
              alignItems:   "center",
              gap:          14,
              marginBottom: 18,
              opacity:      labelOpa,
            }}>
              <div style={{transform: `scale(${iconScale})`, transformOrigin: "center left"}}>
                <NRIcon size={22} color={colors.accent} />
              </div>
              <span style={{
                fontFamily:    `'${FONT_PH}', sans-serif`,
                fontWeight:    700,
                fontSize:      14,
                color:         "rgba(255,255,255,0.50)",
                letterSpacing: 7,
                textTransform: "uppercase" as const,
                lineHeight:    1,
              }}>
                Nutfruit Recipes
              </span>
            </div>

            {/* ── Título principal — Thumpa, clip por palabra ── */}
            <div style={{
              display:      "flex",
              flexWrap:     "wrap",
              gap:          0,
              marginBottom: 14,
            }}>
              {titleWords.map((word, i) => {
                const prog = spring({
                  fps,
                  frame: frame - (T_TITLE + i * 5),
                  config: {damping: 30, stiffness: 220},
                });
                const ty       = interpolate(prog, [0, 1], [105, 0]);
                const trailing = i < titleWords.length - 1 ? " " : "";
                return (
                  <span
                    key={i}
                    style={{
                      display:       "inline-block",
                      overflow:      "hidden",
                      height:        122,
                      verticalAlign: "bottom",
                    }}
                  >
                    <span style={{
                      display:       "block",
                      fontFamily:    `'${FONT_PH_DISPLAY}', sans-serif`,
                      fontWeight:    900,
                      fontSize:      118,
                      color:         colors.white,
                      letterSpacing: -1,
                      lineHeight:    1.034,
                      textTransform: "uppercase" as const,
                      transform:     `translateY(${ty}%)`,
                      whiteSpace:    "pre",
                    }}>
                      {word}{trailing}
                    </span>
                  </span>
                );
              })}
            </div>

            {/* ── Subtítulo — fade in ── */}
            <span style={{
              display:       "inline-block",
              opacity:       subOpa,
              fontFamily:    `'${FONT_PH}', sans-serif`,
              fontWeight:    500,
              fontSize:      34,
              color:         "rgba(255,255,255,0.78)",
              letterSpacing: 3,
              textTransform: "uppercase" as const,
              whiteSpace:    "nowrap",
              lineHeight:    1.35,
            }}>
              {line2}
            </span>

          </div>
        </div>{/* /panel interior */}
      </div>{/* /capa exterior */}

    </AbsoluteFill>
  );
};
