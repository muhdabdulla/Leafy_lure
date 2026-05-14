import React from 'react';
import { motion } from 'framer-motion';
import './Gallery.css';

const images = [
  { src: '/gallery_1.png', alt: 'Intricate Mehndi Design' },
  { src: '/gallery_2.png', alt: 'Minimalist Mehndi Design' },
  { src: '/gallery_3.png', alt: 'Modern Mehndi Design' },
  { src: '/gallery_4.png', alt: 'Traditional Bridal Mehndi' },
];

const Gallery = () => {
  return (
    <section className="gallery-section section-container">
      <div className="content-wrapper">
        <motion.div
          className="gallery-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2>The Art of Mehndi</h2>
          <p>Inspiring designs brought to life by Leafy_lure.</p>
        </motion.div>

        <div className="masonry-grid">
          {images.map((img, index) => (
            <motion.div
              key={index}
              className={`masonry-item item-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="img-overlay">
                <img src={img.src} alt={img.alt} />
                <div className="hover-content">
                  <span className="zoom-icon">+</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
