import React, {useEffect, useMemo, useState} from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const C = {
  white: "#ffffff",
  blue: "#241e8a",
  blueDark: "#241e50",
  blueSoft: "#241e83",
  purple: "#491283",
  red: "#ed1d26",
  yellow: "#fce406",
  ink: "#171343",
  cream: "#fffaf2",
  softPink: "#ffe5ea",
};

const F = {
  westernTitle: "Thumpa",
  thaiTitle: "Martian B Thai ExtraBlack",
  thaiBody: "Martian B Thai Light",
};

const SCENE_1 = 128;
const SCENE_2_START = 112;
const SCENE_2 = 190;
const SCENE_3_START = 286;
const TOTAL = 432;
const FPS = 30;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const photoHands = "assets/Thailandia/generated/match-hero-hands.png";
const photoDuo = "assets/Thailandia/generated/cashew-date-duo.png";
const photoFlatlay = "assets/Thailandia/generated/snack-pair-flatlay.png";
const photoCta = "assets/Thailandia/generated/cta-family-snacks.png";

const useBrandFonts = () => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("Loading Nutfruit Thailand fonts"));

  useEffect(() => {
    if (typeof document === "undefined") {
      continueRender(handle);
      setReady(true);
      return;
    }

    if (!document.getElementById("nf-thailand-fonts")) {
      const style = document.createElement("style");
      style.id = "nf-thailand-fonts";
      style.textContent = `
        @font-face {
          font-family: '${F.westernTitle}';
          src: url('${staticFile("assets/Thailandia/Fonts/Thumpa.otf")}') format('opentype');
        }
        @font-face {
          font-family: '${F.thaiTitle}';
          src: url('${staticFile("assets/Thailandia/Fonts/MartianBThai-ExtraBlack.otf")}') format('opentype');
        }
        @font-face {
          font-family: '${F.thaiBody}';
          src: url('${staticFile("assets/Thailandia/Fonts/MartianBThai-Light.otf")}') format('opentype');
        }
      `;
      document.head.appendChild(style);
    }

    Promise.all([
      document.fonts.load(`400 90px "${F.westernTitle}"`),
      document.fonts.load(`400 90px "${F.thaiTitle}"`),
      document.fonts.load(`400 48px "${F.thaiBody}"`),
    ])
      .catch(() => undefined)
      .finally(() => {
        setReady(true);
        continueRender(handle);
      });
  }, [handle]);

  return ready;
};

const useEase = (delay: number, stiffness = 130, damping = 15) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({
    fps,
    frame: Math.max(0, frame - delay),
    config: {stiffness, damping},
  });
};

const Pattern = ({color = C.blue, opacity = 0.08}: {color?: string; opacity?: number}) => {
  const svg = useMemo(
    () =>
      encodeURIComponent(
        `<svg width="230" height="230" viewBox="0 0 230 230" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" opacity=".72"><path d="M35 64c35-32 71-13 84 12-33 20-65 17-84-12Z"/><path d="M48 63c18 3 35 9 57 15"/><path d="M158 30c31 17 35 50 15 72-23-22-29-49-15-72Z"/><path d="M158 44c6 18 9 31 12 47"/><path d="M58 155c17-29 52-32 73-10-21 21-47 27-73 10Z"/><path d="M80 159c16-4 29-8 44-12"/><path d="M169 150c30 2 38 27 29 47-25-4-39-19-29-47Z"/><path d="M43 111c19-15 37-9 44 4-17 12-33 11-44-4Z"/></g></svg>`,
      ),
    [color],
  );

  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("data:image/svg+xml,${svg}")`,
        backgroundSize: "230px 230px",
        opacity,
      }}
    />
  );
};

const Squiggle = ({color = C.yellow, width = 170}: {color?: string; width?: number}) => {
  const svg = useMemo(
    () =>
      encodeURIComponent(
        `<svg width="180" height="38" viewBox="0 0 180 38" xmlns="http://www.w3.org/2000/svg"><path d="M5 20c14-25 29 25 43 0s29 25 43 0 29 25 43 0 29 25 43 0" fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round"/></svg>`,
      ),
    [color],
  );

  return (
    <div
      style={{
        width,
        height: (width / 180) * 38,
        backgroundImage: `url("data:image/svg+xml,${svg}")`,
        backgroundSize: "100% 100%",
      }}
    />
  );
};

const Star = ({size = 56, color = C.yellow}: {size?: number; color?: string}) => (
  <div
    style={{
      width: size,
      height: size,
      background: color,
      clipPath:
        "polygon(50% 0,60% 33%,95% 15%,72% 45%,100% 50%,72% 55%,95% 85%,60% 67%,50% 100%,40% 67%,5% 85%,28% 55%,0 50%,28% 45%,5% 15%,40% 33%)",
      filter: "drop-shadow(0 7px 0 rgba(0,0,0,0.12))",
    }}
  />
);

const Scalloped = ({
  color,
  top,
  bottom,
  height,
  children,
}: {
  color: string;
  top?: number;
  bottom?: number;
  height: number;
  children?: React.ReactNode;
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top,
      bottom,
      height,
      background: color,
      clipPath:
        "polygon(0 32px,4% 0,8% 32px,12% 0,16% 32px,20% 0,24% 32px,28% 0,32% 32px,36% 0,40% 32px,44% 0,48% 32px,52% 0,56% 32px,60% 0,64% 32px,68% 0,72% 32px,76% 0,80% 32px,84% 0,88% 32px,92% 0,96% 32px,100% 0,100% 100%,0 100%)",
    }}
  >
    {children}
  </div>
);

const PhotoLayer = ({
  src,
  scale = 1,
  y = 0,
  opacity = 1,
  objectPosition = "center center",
}: {
  src: string;
  scale?: number;
  y?: number;
  opacity?: number;
  objectPosition?: string;
}) => (
  <Img
    src={staticFile(src)}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition,
      transform: `scale(${scale}) translateY(${y}px)`,
      opacity,
    }}
  />
);

const ThaiTitle = ({
  children,
  color,
  size,
  delay,
  align = "center",
  shadow = false,
}: {
  children: React.ReactNode;
  color: string;
  size: number;
  delay: number;
  align?: "left" | "center";
  shadow?: boolean;
}) => {
  const p = useEase(delay, 150, 14);
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        fontFamily: F.thaiTitle,
        color,
        fontSize: size,
        lineHeight: 1.02,
        textAlign: align,
        letterSpacing: 0,
        opacity: interpolate(frame, [delay, delay + 10], [0, 1], clamp),
        transform: `translateY(${interpolate(p, [0, 1], [46, 0], clamp)}px)`,
        textShadow: shadow ? "0 8px 0 rgba(0,0,0,0.16)" : undefined,
      }}
    >
      {children}
    </div>
  );
};

const BrandFooter = ({dark = false}: {dark?: boolean}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 54,
      textAlign: "center",
      fontFamily: F.westernTitle,
      color: dark ? C.blue : C.white,
      fontSize: 38,
      letterSpacing: 3,
      zIndex: 20,
    }}
  >
    NUTFRUIT THAILAND
  </div>
);

const FadeScene = ({duration, children}: {duration: number; children: React.ReactNode}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12, duration - 16, duration], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

const Scene1 = () => {
  const frame = useCurrentFrame();
  const blob = useEase(8, 105, 15);
  const photoScale = interpolate(frame, [0, SCENE_1], [1.08, 1.02], clamp);

  return (
    <FadeScene duration={SCENE_1}>
      <AbsoluteFill style={{overflow: "hidden", background: C.blue}}>
        <PhotoLayer src={photoHands} scale={photoScale} y={20} objectPosition="center center" />
        <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(36,30,138,0.04) 0%, rgba(36,30,138,0.22) 46%, rgba(36,30,138,0.55) 100%)`}} />

        <div
          style={{
            position: "absolute",
            top: 118,
            left: 76,
            right: 76,
            zIndex: 8,
            transform: `scale(${interpolate(blob, [0, 1], [0.82, 1], clamp)}) rotate(${interpolate(blob, [0, 1], [-4, 0], clamp)}deg)`,
            transformOrigin: "center",
          }}
        >
          <div
            style={{
              background: C.red,
              borderRadius: "58% 42% 50% 48% / 28% 32% 68% 72%",
              padding: "68px 54px 64px",
              minHeight: 390,
              boxShadow: "0 28px 70px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22}}>
              <Squiggle color={C.blue} width={130} />
              <div style={{fontFamily: F.westernTitle, color: C.yellow, fontSize: 66, transform: "rotate(-8deg)"}}>
                YASSI
              </div>
            </div>
            <ThaiTitle color={C.white} size={86} delay={12} shadow>
              มาเล่นจับคู่
            </ThaiTitle>
            <div style={{marginTop: 20, fontFamily: F.thaiBody, color: C.white, fontSize: 48, lineHeight: 1.34, textAlign: "center"}}>
              ของกินเล่นที่ทั้งอร่อย
              <br />
              และสนุกกันเถอะ
            </div>
          </div>
        </div>

        <div style={{position: "absolute", top: 610, left: 54, transform: `rotate(${frame * 0.6}deg)`, zIndex: 9}}>
          <Star size={70} color={C.yellow} />
        </div>
        <div style={{position: "absolute", top: 620, right: 70, transform: `rotate(${-frame * 0.7}deg)`, zIndex: 9}}>
          <Star size={54} color={C.red} />
        </div>

        <Scalloped color={C.yellow} height={372} bottom={0}>
          <div style={{position: "absolute", top: 112, left: 70, right: 70, fontFamily: F.thaiTitle, color: C.red, fontSize: 58, lineHeight: 1.12, textAlign: "center"}}>
            ไอเดียจับคู่ของว่าง
            <br />
            ที่กินแล้วไม่เบื่อ
          </div>
          <div style={{position: "absolute", bottom: 48, left: 0, right: 0, display: "flex", justifyContent: "center"}}>
            <Squiggle color={C.red} width={360} />
          </div>
        </Scalloped>
      </AbsoluteFill>
    </FadeScene>
  );
};

const Scene2 = () => {
  const frame = useCurrentFrame();
  const headline = useEase(6, 125, 15);
  const card = useEase(34, 115, 15);
  const copy = useEase(64, 95, 16);
  const plus = useEase(24, 180, 11);

  return (
    <FadeScene duration={SCENE_2}>
      <AbsoluteFill style={{background: C.blue, overflow: "hidden"}}>
        <PhotoLayer src={photoDuo} scale={interpolate(frame, [0, SCENE_2], [1.03, 1], clamp)} objectPosition="center center" />
        <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(36,30,138,0.02) 0%, rgba(36,30,138,0.06) 56%, rgba(36,30,138,0.42) 100%)"}} />

        <div
          style={{
            position: "absolute",
            top: 92,
            left: 64,
            right: 64,
            zIndex: 8,
            opacity: headline,
            transform: `translateY(${interpolate(headline, [0, 1], [60, 0], clamp)}px)`,
          }}
        >
          <div
            style={{
              background: C.red,
              borderRadius: "42px 42px 96px 42px",
              padding: "42px 42px 46px",
              boxShadow: "0 24px 58px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12}}>
              <Squiggle color={C.yellow} width={140} />
              <Star size={58} color={C.yellow} />
            </div>
            <div style={{fontFamily: F.thaiTitle, color: C.white, fontSize: 64, lineHeight: 1.14, textAlign: "center"}}>
            เม็ดมะม่วงหิมพานต์
            <span style={{color: C.yellow}}> + </span>
            อินทผาลัม
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 406,
            left: 98,
            width: 354,
            height: 520,
            borderRadius: 38,
            overflow: "hidden",
            border: `9px solid ${C.white}`,
            boxShadow: "0 30px 72px rgba(0,0,0,0.32)",
            transform: `translateY(${interpolate(card, [0, 1], [120, 0], clamp)}px) rotate(-7deg)`,
            opacity: card,
            zIndex: 8,
          }}
        >
          <PhotoLayer src={photoFlatlay} scale={1.18} y={34} objectPosition="center center" />
        </div>

        <div
          style={{
            position: "absolute",
            top: 700,
            right: 74,
            width: 132,
            height: 132,
            borderRadius: "50%",
            background: C.yellow,
            transform: `scale(${interpolate(plus, [0, 1], [0.2, 1], clamp)}) rotate(${interpolate(plus, [0, 1], [-90, 0], clamp)}deg)`,
            boxShadow: "0 16px 34px rgba(0,0,0,0.26)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Arial, sans-serif",
            fontSize: 86,
            fontWeight: 900,
            color: C.blue,
            zIndex: 8,
          }}
        >
          +
        </div>

        <Scalloped color={C.red} height={430} bottom={0}>
          <div
            style={{
              position: "absolute",
              top: 90,
              left: 66,
              right: 66,
              transform: `translateY(${interpolate(copy, [0, 1], [100, 0], clamp)}px)`,
              opacity: copy,
              zIndex: 10,
            }}
          >
            <div style={{fontFamily: F.thaiTitle, color: C.white, fontSize: 62, lineHeight: 1.14, textAlign: "center"}}>
              กรอบนิด นุ่มหน่อย
              <br />
              หวานกำลังดี
            </div>
            <div style={{marginTop: 24, fontFamily: F.thaiBody, color: C.white, fontSize: 40, lineHeight: 1.32, textAlign: "center"}}>
              เป็นคู่ที่ลองแล้วอาจจะชอบ
            </div>
            <div style={{marginTop: 24, display: "flex", justifyContent: "center", transform: `translateX(${Math.sin(frame / 18) * 18}px)`}}>
              <Squiggle color={C.yellow} width={270} />
            </div>
          </div>
        </Scalloped>
      </AbsoluteFill>
    </FadeScene>
  );
};

const Scene3 = () => {
  const frame = useCurrentFrame();
  const title = useEase(6, 150, 12);
  const text = useEase(34, 95, 15);
  const cta = useEase(64, 105, 14);

  return (
    <AbsoluteFill style={{background: `linear-gradient(150deg, ${C.blueDark}, ${C.blue})`, overflow: "hidden"}}>
      <PhotoLayer src={photoCta} scale={interpolate(frame, [0, TOTAL - SCENE_3_START], [1.04, 1], clamp)} objectPosition="center center" />
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(36,30,138,0.05) 0%, rgba(36,30,138,0.14) 48%, rgba(36,30,138,0.42) 100%)"}} />
      <Pattern color={C.white} opacity={0.045} />

      <div style={{position: "absolute", top: 84, left: 62, transform: `rotate(${frame * 0.7}deg)`}}>
        <Star size={70} color={C.yellow} />
      </div>
      <div style={{position: "absolute", top: 124, right: 68, transform: `rotate(${-frame * 0.65}deg)`}}>
        <Star size={58} color={C.red} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 178,
          left: 78,
          right: 78,
          textAlign: "center",
          opacity: title,
          transform: `scale(${interpolate(title, [0, 1], [0.72, 1], clamp)})`,
          zIndex: 6,
        }}
      >
        <div style={{fontFamily: F.thaiTitle, color: C.yellow, fontSize: 126, lineHeight: 0.96, textShadow: "0 9px 0 rgba(0,0,0,0.18)"}}>
          ลองจับคู่ดูสิ!
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 88,
          right: 88,
          top: 720,
          background: C.white,
          borderRadius: 46,
          padding: "48px 44px",
          boxShadow: "0 28px 70px rgba(0,0,0,0.26)",
          transform: `translateY(${interpolate(text, [0, 1], [82, 0], clamp)}px)`,
          opacity: text,
          zIndex: 6,
        }}
      >
        <div style={{fontFamily: F.thaiBody, color: C.blue, fontSize: 48, lineHeight: 1.44, textAlign: "center"}}>
          อีกหนึ่งวิธีสนุก ๆ
          <br />
          ในการกินของว่าง 💛
        </div>
        <div style={{display: "flex", justifyContent: "center", marginTop: 24}}>
          <Squiggle color={C.red} width={230} />
        </div>
      </div>

      <Scalloped color={C.red} height={420} bottom={0}>
        <div
          style={{
            position: "absolute",
            top: 96,
            left: 72,
            right: 72,
            transform: `translateY(${interpolate(cta, [0, 1], [88, 0], clamp)}px)`,
            opacity: cta,
          }}
        >
          <div style={{fontFamily: F.thaiTitle, color: C.white, fontSize: 58, lineHeight: 1.18, textAlign: "center"}}>
            กดติดตามไว้เลย
          </div>
          <div style={{marginTop: 16, fontFamily: F.thaiBody, color: C.yellow, fontSize: 42, lineHeight: 1.28, textAlign: "center"}}>
            มีไอเดียดี ๆ อีกเพียบ
          </div>
        </div>
        <BrandFooter />
      </Scalloped>
    </AbsoluteFill>
  );
};

export const NutfruitThailandJabKhu: React.FC = () => {
  const fontsReady = useBrandFonts();

  if (!fontsReady) {
    return null;
  }

  return (
    <>
      <Sequence from={0} durationInFrames={SCENE_1} layout="none">
        <Scene1 />
      </Sequence>
      <Sequence from={SCENE_2_START} durationInFrames={SCENE_2} layout="none">
        <Scene2 />
      </Sequence>
      <Sequence from={SCENE_3_START} durationInFrames={TOTAL - SCENE_3_START} layout="none">
        <Scene3 />
      </Sequence>
    </>
  );
};

export const nutfruitThailandJabKhuDuration = TOTAL;
export const nutfruitThailandJabKhuFps = FPS;
