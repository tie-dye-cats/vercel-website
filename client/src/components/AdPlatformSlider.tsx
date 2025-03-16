import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Platform {
  name: string;
  color: string;
}

const platforms: Platform[] = [
  { name: 'Facebook', color: '#1877F2' }, // Official Facebook blue
  { name: 'Google', color: '#EA4335' },   // Official Google red
  { name: 'TikTok', color: '#00f2ea' }    // TikTok neon cyan
];

export function AdPlatformSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % platforms.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block min-w-[100px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block"
          style={{ color: platforms[currentIndex].color }}
        >
          {platforms[currentIndex].name}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}