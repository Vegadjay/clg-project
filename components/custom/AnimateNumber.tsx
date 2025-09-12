"use client";
import { useState } from "react";
import { useSpring, motion } from "motion/react";

type AnimatedNumberProps = {
  number?: number;
};

export const AnimatedNumber_002 = ({ number }: AnimatedNumberProps) => {
  const [displaySubs, setDisplaySubs] = useState(number || 0);

  const springSubCount = useSpring(0, {
    bounce: 0,
    duration: 1000,
  });

  springSubCount.on("change", (value) => {
    setDisplaySubs(Math.round(value));
  });

  const animate = () => {
    springSubCount.set(number || 0);
  };

  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      <motion.div
        onViewportEnter={animate}
        onViewportLeave={() => {
          springSubCount.set(0);
        }}
        className="tracking-tight"
      >
        {displaySubs}
      </motion.div>
    </div>
  );
};
