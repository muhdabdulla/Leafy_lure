import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const TOTAL_FRAMES = 240;
const LOOP_START_FRAME = 100; // Adjust this to the frame where rotation starts after leaves go

const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [frameIndex, setFrameIndex] = useState(1);
  const containerRef = useRef(null);
  const loadedCountRef = useRef(0);

  // Intelligent sequential preload
  useEffect(() => {
    let isMounted = true;
    const preloadImages = async () => {
      // Preload the very first frame immediately so it shows instantly
      loadedCountRef.current = 1;
      
      for (let i = 2; i <= TOTAL_FRAMES; i++) {
        if (!isMounted) break;
        await new Promise((resolve) => {
          const img = new Image();
          img.src = `/images/herosection/ezgif-frame-${String(i).padStart(3, '0')}.png`;
          img.onload = resolve;
          img.onerror = resolve; // Skip missing frames
        });
        if (isMounted) {
          loadedCountRef.current = i;
        }
      }
    };
    preloadImages();
    return () => { isMounted = false; };
  }, []);

  // Auto-play animation loop tied to loaded frames
  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();
    const fps = 30; // Adjust FPS for speed
    const frameInterval = 1000 / fps;

    const animate = (currentTime) => {
      if (currentTime - lastTime >= frameInterval) {
        setFrameIndex((prev) => {
          let next = prev >= TOTAL_FRAMES ? LOOP_START_FRAME : prev + 1;
          // Only advance if the next frame has been downloaded (acts like buffering)
          return next <= loadedCountRef.current ? next : prev;
        });
        lastTime = currentTime;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

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

  return (
    <section ref={containerRef} className="hero-section">
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
    </section>
  );
};

export default Hero;
