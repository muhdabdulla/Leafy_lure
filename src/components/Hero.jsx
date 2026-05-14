import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import './Hero.css';

const TOTAL_FRAMES = 240;

const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [frameIndex, setFrameIndex] = useState(1);
  const containerRef = useRef(null);

  // Scroll scrubbing animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const frameTransform = useTransform(scrollYProgress, [0, 1], [1, TOTAL_FRAMES]);

  useMotionValueEvent(frameTransform, "change", (latest) => {
    setFrameIndex(Math.max(1, Math.min(TOTAL_FRAMES, Math.round(latest))));
  });

  // Mouse parallax tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = (clientX / innerWidth) - 0.5;
      const y = (clientY / innerHeight) - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Preload initial frames
  useEffect(() => {
    for(let i = 1; i <= 20; i++) {
      const img = new Image();
      img.src = `/images/herosection/ezgif-frame-${String(i).padStart(3, '0')}.png`;
    }
  }, []);

  // Fade out text as we scroll down
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  return (
    <section ref={containerRef} className="hero-section">
      <div className="hero-sticky-container">
        
        {/* Blurred Background to fill empty space seamlessly */}
        <div className="hero-background-blur-wrapper">
          <motion.img 
            src={`/images/herosection/ezgif-frame-${String(frameIndex).padStart(3, '0')}.png`} 
            alt="" 
            className="hero-background-blur"
          />
        </div>

        {/* Image Sequence tied to scroll */}
        <div className="hero-image-wrapper">
          <motion.img 
            src={`/images/herosection/ezgif-frame-${String(frameIndex).padStart(3, '0')}.png`} 
            alt="Leafy_lure Henna Animation" 
            className="hero-cone-sequence"
            style={{
              x: mousePos.x * -20,
              y: mousePos.y * -20,
            }}
          />
        </div>

        {/* Light glow following cursor */}
        <motion.div
          className="cursor-glow"
          animate={{
            x: mousePos.x * 200 + 'px',
            y: mousePos.y * 200 + 'px',
          }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.5 }}
        />

        <motion.div 
          className="hero-content"
          style={{ opacity: textOpacity, y: textY }}
        >
          <div className="hero-text-container">
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            >
              Leafy_lure
            </motion.h1>
            <motion.p 
              className="hero-tagline"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            >
              Pure Organic Henna Crafted Naturally
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
