import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {C, FONT, useNRFonts, NRIcon} from "./shared";

export interface Ingredient { name: string; amount?: string; }

export interface IngredientsProps {
  title?:       string;
  ingredients?: Ingredient[];
  columns?:     1 | 2;
}

const DEFAULT_INGREDIENTS: Ingredient[] = [
  {name: "Avellanas tostadas",   amount: "200g"},
  {name: "Mantequilla sin sal",  amount: "80g"},
  {name: "Azúcar moreno",        amount: "120g"},
  {name: "Huevos",               amount: "3 uds"},
  {name: "Harina de trigo",      amount: "160g"},
  {name: "Cacao en polvo",       amount: "40g"},
  {name: "Sal",                  amount: "1 pizca"},
];

const DEFAULT: Required<IngredientsProps> = {
  title:       "INGREDIENTES",
  ingredients: DEFAULT_INGREDIENTS,
  columns:     1,
};

// Timing constants
const T_ICON   = 0;
const T_TITLE  = 4;
const T_RULE   = 18;
const T_FIRST  = 26;
const STAGGER  = 6;

export const Ingredients: React.FC<IngredientsProps> = (raw) => {
  const props = {...DEFAULT, ...raw};
  const {title, ingredients, columns} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {ready} = useNRFonts();

  const n = ingredients.length;
  const EXIT = T_FIRST + (n - 1) * STAGGER + 50;

  const fade = interpolate(frame, [EXIT, EXIT + 18], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const sp = (delay: number, d: number, s: number) =>
    spring({fps, frame: frame - delay, config: {damping: d, stiffness: s}, durationInFrames: 30});

  // icon pops in
  const iconProg  = sp(T_ICON, 10, 260);
  const iconScale = interpolate(iconProg, [0, 1], [0, 1]);

  // title clips up
  const titleProg = sp(T_TITLE, 26, 300);
  const titleTY   = interpolate(titleProg, [0, 1], [105, 0]);

  // rule expands
  const ruleProg   = sp(T_RULE, 28, 320);
  const ruleScaleX = interpolate(ruleProg, [0, 1], [0, 1]);

  if (!ready) return <AbsoluteFill style={{background: C.greenDark}} />;

  const cols: Ingredient[][] =
    columns === 2
      ? [ingredients.slice(0, Math.ceil(n / 2)), ingredients.slice(Math.ceil(n / 2))]
      : [ingredients];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #1d4229 0%, ${C.greenDark} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "72px 130px",
        overflow: "hidden",
      }}
    >
      {/* left edge accent */}
      <div style={{
        position: "absolute",
        left: 0, top: 0, bottom: 0,
        width: 6,
        background: C.red,
        opacity: fade,
      }} />

      {/* ── header row ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        marginBottom: 12,
        opacity: fade,
      }}>
        <div style={{
          transform: `scale(${iconScale})`,
          transformOrigin: "center",
        }}>
          <NRIcon size={56} color={C.red} />
        </div>

        <div style={{overflow: "hidden", height: 84}}>
          <div style={{
            transform: `translateY(${titleTY}%)`,
            fontFamily: `'${FONT}', sans-serif`,
            fontWeight: 900,
            fontSize: 80,
            color: C.white,
            letterSpacing: 5,
            textTransform: "uppercase" as const,
            lineHeight: 84 / 80,
          }}>
            {title}
          </div>
        </div>
      </div>

      {/* rule */}
      <div style={{
        width: 420,
        height: 3,
        background: C.red,
        transformOrigin: "left center",
        transform: `scaleX(${ruleScaleX})`,
        marginBottom: 30,
        opacity: fade,
      }} />

      {/* ── ingredient list ── */}
      <div style={{display: "flex", gap: 64, width: "100%"}}>
        {cols.map((col, ci) => (
          <div key={ci} style={{display: "flex", flexDirection: "column", gap: 12, flex: 1}}>
            {col.map((item, ii) => {
              const gi    = ci * Math.ceil(n / 2) + ii;
              const delay = T_FIRST + gi * STAGGER;

              // item: whole row clips in from left
              const itemProg = sp(delay, 24, 280);
              const itemClip = interpolate(itemProg, [0, 1], [100, 0]);
              const itemOpa  = interpolate(itemProg, [0, 0.3, 1], [0, 1, 1]);

              // amount: scale-pops after item, slight delay
              const amtProg  = sp(delay + 7, 10, 260);
              const amtScale = interpolate(amtProg, [0, 1], [0, 1]);

              return (
                <div
                  key={ii}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    opacity: itemOpa * fade,
                    clipPath: `inset(0 0 0 ${itemClip}%)`,
                  }}
                >
                  {/* dot */}
                  <div style={{
                    width: 8, height: 8,
                    borderRadius: "50%",
                    background: C.red,
                    flexShrink: 0,
                  }} />

                  {/* name */}
                  <span style={{
                    fontFamily: `'${FONT}', sans-serif`,
                    fontWeight: 600,
                    fontSize: 46,
                    color: C.white,
                    flex: 1,
                  }}>
                    {item.name}
                  </span>

                  {/* amount pill */}
                  {item.amount && (
                    <div style={{
                      transform: `scale(${amtScale})`,
                      transformOrigin: "right center",
                      background: C.red,
                      borderRadius: 6,
                      padding: "4px 18px",
                      fontFamily: `'${FONT}', sans-serif`,
                      fontWeight: 800,
                      fontSize: 34,
                      color: C.white,
                      flexShrink: 0,
                    }}>
                      {item.amount}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
