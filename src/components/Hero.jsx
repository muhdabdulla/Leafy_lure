import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const LOOP_START_TIME = 4; // Frame 100 at 30fps is ~3.33s. Adjust this to the exact second where rotation starts.

const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mainVideoRef = useRef(null);
  const bgVideoRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-play and loop video at specific time
  useEffect(() => {
    const mainVid = mainVideoRef.current;
    const bgVid = bgVideoRef.current;
    if (!mainVid || !bgVid) return;

    const handleTimeUpdate = () => {
      // If we've reached the very end of the video, jump back to LOOP_START_TIME
      if (mainVid.duration && mainVid.currentTime >= mainVid.duration - 0.05) {
        mainVid.currentTime = LOOP_START_TIME;
        bgVid.currentTime = LOOP_START_TIME;
        mainVid.play().catch(() => { });
        bgVid.play().catch(() => { });
      }
    };

    mainVid.addEventListener('timeupdate', handleTimeUpdate);
    return () => mainVid.removeEventListener('timeupdate', handleTimeUpdate);
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
        <video
          ref={bgVideoRef}
          src="/images/herosection/hero-video.mp4"
          autoPlay
          muted
          playsInline
          className="hero-background-blur"
        />
      </div>

      {/* Video Sequence */}
      <div className="hero-image-wrapper">
        <motion.video
          ref={mainVideoRef}
          src="/images/herosection/hero-video.mp4"
          autoPlay
          muted
          playsInline
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
