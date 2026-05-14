import React from 'react';
import { motion } from 'framer-motion';
import './Story.css';

const Story = () => {
  return (
    <section className="story-section section-container">
      <div className="story-parallax-bg" />
      <div className="content-wrapper story-content">
        <motion.div 
          className="story-text-block glass"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <h2>Handcrafted With Care</h2>
          <p>
            Our journey begins in lush, organic farms where only the finest henna leaves are handpicked. 
            We believe in preserving the traditional art of mehndi preparation, combining age-old techniques 
            with modern quality standards.
          </p>
          <p>
            Every cone of Leafy_lure is a testament to our commitment to purity. No chemicals, no compromises. 
            Just the profound, earthy scent of nature and a dark, beautiful stain that speaks of genuine quality.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Story;
