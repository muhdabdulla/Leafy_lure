import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ShopModal.css';

const ShopModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
          >
            <button className="close-btn" onClick={onClose}>&times;</button>
            <h2 className="modal-title">Our Products</h2>
            <div className="products-grid">
              
              {/* Product 1 */}
              <div className="product-card">
                <div className="product-image-container">
                  <img src="/cone.png" alt="Organic Henna Cones" />
                </div>
                <h3>Organic Henna Cones</h3>
                <p className="price">₹50 per cone</p>
              </div>

              {/* Product 2 */}
              <div className="product-card">
                <div className="product-image-container">
                  <img src="/haircone.jpeg" alt="Hair Henna Cones" />
                </div>
                <h3>Hair Henna Cones</h3>
                <p className="price">₹250</p>
              </div>

            </div>
            
            <div className="order-info">
              <p>To place an order, please contact us via Instagram:</p>
              <a 
                href="https://www.instagram.com/leafy_lure?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary instagram-btn"
              >
                Message @leafy_lure
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShopModal;
