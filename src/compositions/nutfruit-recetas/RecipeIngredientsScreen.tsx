import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {ColorCtx, FONT, useNRFonts, NRIcon} from "./shared";

export interface RecipeIngredientsScreenProps {
  recipeName?:      string;
  recipeVariant?:   string;
  ingredients?:     {name: string; amount?: string}[];
  servings?:        string;
  time?:            string;
  fadeInDuration?:  number; // frames for fade-in (default 25 = 1s @ 25fps)
  fadeOutAt?:       number; // frame where content starts fading out
}

const DEFAULTS: Required<RecipeIngredientsScreenProps> = {
  recipeName:     "CHILAQUILES",
  recipeVariant:  "ROJOS",
  ingredients:    [],
  servings:       "2 personas",
  time:           "15 min",
  fadeInDuration: 25,
  fadeOutAt:      120,
};

// Animation timings (relative to sequence start)
const T_ICON  = 0;
const T_BRAND = 5;
const T_TITLE = 10;
const T_PILL  = 23;
const T_RULE  = 29;
const T_HEAD  = 35;
const T_FIRST = 40;
const STAGGER = 5;

export const RecipeIngredientsScreen: React.FC<RecipeIngredientsScreenProps> = (raw) => {
  const props = {...DEFAULTS, ...raw};
  const {recipeName, recipeVariant, ingredients, servings, time, fadeInDuration, fadeOutAt} = props;

  const frame              = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const {ready}            = useNRFonts();
  const colors             = React.useContext(ColorCtx);

  const n    = ingredients.length;
  const half = Math.ceil(n / 2);
  const col1 = ingredients.slice(0, half);
  const col2 = ingredients.slice(half);

  // ── Opacity layers ──────────────────────────────────────────────────────────
  // 1. Content fade-out: elements start fading at fadeOutAt
  const contentFade = interpolate(frame, [fadeOutAt, fadeOutAt + 20], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // 2. Global overlay fade (entire component including background):
  //    fades IN over fadeInDuration, stays 1, then fades OUT to 0 by sequence end
  const globalFadeIn  = interpolate(frame, [0, fadeInDuration], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const globalFadeOut = interpolate(frame, [fadeOutAt + 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const globalOpa = Math.min(globalFadeIn, globalFadeOut);

  // ── Spring helper ────────────────────────────────────────────────────────────
  const sp = (delay: number, d: number, s: number) =>
    spring({fps, frame: frame - delay, config: {damping: d, stiffness: s}, durationInFrames: 30});

  // Brand
  const iconScale = interpolate(sp(T_ICON, 12, 260), [0, 1], [0, 1]);
  const brandOpa  = interpolate(frame, [T_BRAND, T_BRAND + 14], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Title words
  const titleWords = recipeName.split(" ");

  // Variant pill
  const pillScaleX  = interpolate(sp(T_PILL, 22, 320), [0, 1], [0.02, 1]);
  const pillTextOpa = interpolate(frame, [T_PILL + 8, T_PILL + 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Vertical rule
  const ruleScaleY = interpolate(sp(T_RULE, 20, 300), [0, 1], [0, 1]);

  // Ingredients header
  const headOpa = interpolate(frame, [T_HEAD, T_HEAD + 14], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Metadata
  const metaOpa = interpolate(frame, [T_RULE + 10, T_RULE + 24], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  if (!ready) return <AbsoluteFill style={{background: colors.dark, opacity: globalOpa}} />;

  // Ingredient row renderer
  const ingRow = (item: {name: string; amount?: string}, gi: number) => {
    const delay    = T_FIRST + gi * STAGGER;
    const itemProg = sp(delay, 24, 280);
    const itemClip = interpolate(itemProg, [0, 1], [100, 0]);
    const itemOpa  = interpolate(itemProg, [0, 0.3, 1], [0, 1, 1]);
    const amtScale = interpolate(sp(delay + 6, 10, 260), [0, 1], [0, 1]);

    return (
      <div
        key={gi}
        style={{
          display: "flex", alignItems: "center", gap: 14,
          opacity: itemOpa * contentFade,
          clipPath: `inset(0 0 0 ${itemClip}%)`,
        }}
      >
        <div style={{width: 8, height: 8, borderRadius: "50%", background: colors.accent, flexShrink: 0}} />
        <span style={{
          fontFamily: `'${FONT}', sans-serif`,
          fontWeight: 600, fontSize: 38,
          color: colors.white, flex: 1, lineHeight: 1.2,
        }}>
          {item.name}
        </span>
        {item.amount && (
          <div style={{
            transform: `scale(${amtScale})`, transformOrigin: "right center",
            background: colors.accent, borderRadius: 6, padding: "4px 16px",
            fontFamily: `'${FONT}', sans-serif`,
            fontWeight: 800, fontSize: 28, color: colors.white, flexShrink: 0,
          }}>
            {item.amount}
          </div>
        )}
      </div>
    );
  };

  return (
    // Outer wrapper controls global opacity (fade in + fade out over video)
    <AbsoluteFill style={{opacity: globalOpa}}>

      {/* Background */}
      <AbsoluteFill style={{
        background: colors.dark,
        overflow: "hidden",
      }}>
        {/* Left red accent bar */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 6,
          background: colors.accent, opacity: contentFade,
        }} />

        {/* Watermark icon */}
        <div style={{
          position: "absolute", right: 56, top: 44,
          opacity: 0.055 * contentFade, pointerEvents: "none",
        }}>
          <NRIcon size={310} color={colors.white} />
        </div>


        {/* ── Main layout ── */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center",
          padding: "0 120px", gap: 72,
        }}>

          {/* ── LEFT: Recipe identity ── */}
          <div style={{
            flex: "0 0 460px",
            display: "flex", flexDirection: "column", alignItems: "flex-start",
            opacity: contentFade,
          }}>

            {/* Brand */}
            <div style={{
              display: "flex", alignItems: "center", gap: 14,
              marginBottom: 32, opacity: brandOpa,
            }}>
              <div style={{transform: `scale(${iconScale})`, transformOrigin: "center"}}>
                <NRIcon size={34} color={colors.accent} />
              </div>
              <span style={{
                fontFamily: `'${FONT}', sans-serif`,
                fontWeight: 700, fontSize: 20,
                color: "rgba(255,255,255,0.55)", letterSpacing: 5,
                textTransform: "uppercase" as const,
              }}>
                Nutfruit Recetas
              </span>
            </div>

            {/* Recipe name — word-by-word clip reveal */}
            {titleWords.map((word, i) => {
              const prog = sp(T_TITLE + i * 5, 26, 300);
              const ty   = interpolate(prog, [0, 1], [105, 0]);
              return (
                <div key={i} style={{overflow: "hidden", height: 104, lineHeight: 1, marginBottom: 2}}>
                  <div style={{
                    transform: `translateY(${ty}%)`,
                    fontFamily: `'${FONT}', sans-serif`,
                    fontWeight: 900, fontSize: 96,
                    color: colors.white, letterSpacing: -1, lineHeight: 1,
                    textTransform: "uppercase" as const,
                  }}>
                    {word}
                  </div>
                </div>
              );
            })}

            {/* Variant pill */}
            {recipeVariant && (
              <div style={{
                transform: `scaleX(${pillScaleX})`, transformOrigin: "left center",
                background: colors.accent, borderRadius: 8,
                padding: "8px 28px", marginTop: 8, marginBottom: 24,
                boxShadow: "0 6px 28px rgba(0,0,0,0.5)",
              }}>
                <span style={{
                  opacity: pillTextOpa,
                  fontFamily: `'${FONT}', sans-serif`,
                  fontWeight: 900, fontSize: 52,
                  color: colors.white, letterSpacing: 3,
                  textTransform: "uppercase" as const,
                  lineHeight: 1.15, display: "block", whiteSpace: "normal",
                }}>
                  {recipeVariant}
                </span>
              </div>
            )}

            {/* Metadata */}
            <div style={{opacity: metaOpa}}>
              <span style={{
                fontFamily: `'${FONT}', sans-serif`,
                fontWeight: 500, fontSize: 23,
                color: "rgba(255,255,255,0.48)", letterSpacing: 2,
                textTransform: "uppercase" as const,
              }}>
                {servings}&nbsp;&nbsp;·&nbsp;&nbsp;{time}
              </span>
            </div>
          </div>

          {/* ── CENTER: Vertical rule ── */}
          <div style={{
            width: 3, height: 490, flexShrink: 0,
            background: `linear-gradient(to bottom, transparent, ${colors.accent} 12%, ${colors.accent} 88%, transparent)`,
            transformOrigin: "top center",
            transform: `scaleY(${ruleScaleY})`,
            opacity: contentFade,
          }} />

          {/* ── RIGHT: Ingredients ── */}
          <div style={{flex: 1, display: "flex", flexDirection: "column"}}>

            <div style={{
              fontFamily: `'${FONT}', sans-serif`,
              fontWeight: 800, fontSize: 28,
              color: colors.accent, letterSpacing: 6,
              textTransform: "uppercase" as const,
              marginBottom: 24,
              opacity: headOpa * contentFade,
            }}>
              INGREDIENTES
            </div>

            <div style={{display: "flex", gap: 48}}>
              <div style={{flex: 1, display: "flex", flexDirection: "column", gap: 18}}>
                {col1.map((item, ii) => ingRow(item, ii))}
              </div>
              {col2.length > 0 && (
                <div style={{flex: 1, display: "flex", flexDirection: "column", gap: 18}}>
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
