import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplets, Sparkles, Move, Heart } from 'lucide-react';
import './Benefits.css';

const features = [
  { icon: Leaf, title: '100% Organic', desc: 'Sourced directly from organic farms.' },
  { icon: Droplets, title: 'Chemical Free', desc: 'No PPD, no ammonia, no preservatives.' },
  { icon: Sparkles, title: 'Dark Natural Stain', desc: 'Rich, deep color that lasts.' },
  { icon: Move, title: 'Smooth Application', desc: 'Perfect consistency for intricate designs.' },
  { icon: Heart, title: 'Skin Friendly', desc: 'Gentle on all skin types.' },
];

const Benefits = () => {
  return (
    <section className="benefits-section section-container">
      <div className="content-wrapper">
        <motion.div
          className="benefits-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2>The Purest Ingredients</h2>
          <p>Experience the luxury of nature with every application.</p>
        </motion.div>

        <div className="benefits-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="benefit-card glass"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="icon-container">
                <feature.icon size={32} color="var(--color-olive-green)" />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
