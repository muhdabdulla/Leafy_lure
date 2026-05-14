import React from 'react';
import { motion } from 'framer-motion';
import './CTA.css';

const CTA = () => {
  return (
    <section className="cta-section section-container">
      {/* Animated mehndi pattern background overlay */}
      <div className="cta-pattern-bg" />
      
      {/* Floating particles */}
      <div className="cta-particles">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            animate={{
              y: ["0vh", "-100vh"],
              x: ["0vw", `${Math.random() * 20 - 10}vw`],
              opacity: [0, 0.8, 0],
              scale: [0, Math.random() + 0.5, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
            style={{
              left: `${Math.random() * 100}vw`,
              top: '100%'
            }}
          />
        ))}
      </div>

      <div className="content-wrapper cta-content">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="cta-title">Bring Nature to Your Art</h2>
          <button className="btn-primary cta-btn">Shop Leafy_lure</button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
