import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const platforms = ['Facebook', 'Google', 'TikTok'];

export function AdPlatformSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % platforms.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block min-w-[100px] text-blue-400">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block"
        >
          {platforms[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
