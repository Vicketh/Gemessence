import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const [location] = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("fadeOut");
    }
  }, [location, displayLocation]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={displayLocation}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onAnimationComplete={() => {
          if (transitionStage === "fadeOut") {
            setDisplayLocation(location);
            setTransitionStage("fadeIn");
          }
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
