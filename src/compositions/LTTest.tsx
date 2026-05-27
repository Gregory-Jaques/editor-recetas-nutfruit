import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {NattyLowerThird} from "./NattyLowerThird";

export const LTTest: React.FC = () => {
  return (
    <AbsoluteFill style={{background: "white"}}>
      <NattyLowerThird fromFrame={0} durationFrames={300} />
    </AbsoluteFill>
  );
};
