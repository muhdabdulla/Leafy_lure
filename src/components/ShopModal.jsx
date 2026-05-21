import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ShopModal.css';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_5P9L4tA6Lh3sT1';

const PRODUCTS = [
  {
    id: 'henna-cones',
    name: 'Organic Henna Cones',
    price: 50,
    image: '/cone.png',
    description: 'Naturally sourced organic henna cones made from handpicked leaves. Chemical-free with deep mahogany staining.'
  },
  {
    id: 'haircone',
    name: 'Hair Henna Cones',
    price: 250,
    image: '/haircone.jpeg',
    description: 'Premium herbal henna blend enriched with AMLA, Shikakai, and Bhringraj for conditioning and deep natural color.'
  }
];

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const ShopModal = ({ isOpen, onClose }) => {
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('products'); // 'products', 'cart', 'processing', 'success'
  const [quantities, setQuantities] = useState({
    'henna-cones': 1,
    'haircone': 1
  });
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [orderReceipt, setOrderReceipt] = useState(null);

  // Load Razorpay on component mount if modal is open
  useEffect(() => {
    if (isOpen) {
      loadRazorpayScript();
    }
  }, [isOpen]);

  const handleQtyChange = (productId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  const addToCart = (product) => {
    const qty = quantities[product.id] || 1;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    // Reset selection quantity back to 1
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const updateCartQty = (productId, delta) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getShippingFee = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= 500 ? 0 : 40;
  };

  const getGrandTotal = () => {
    return getSubtotal() + getShippingFee();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Simulated Demo checkout logic to bypass API Key restrictions
  const simulateCheckoutSuccess = () => {
    setView('processing');
    
    setTimeout(() => {
      const subtotal = getSubtotal();
      const shipping = getShippingFee();
      const grandTotal = getGrandTotal();
      const simulatedPaymentId = 'pay_MOCK' + Math.random().toString(36).substr(2, 9).toUpperCase();

      setOrderReceipt({
        paymentId: simulatedPaymentId,
        date: new Date().toLocaleString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        items: [...cart],
        subtotal: subtotal,
        shipping: shipping,
        total: grandTotal,
        deliveryAddress: `${customerInfo.address || '123 Green Valley, Forest Road'}, ${customerInfo.city || 'Mumbai'}, ${customerInfo.state || 'Maharashtra'} - ${customerInfo.pincode || '400001'}`,
        customerName: customerInfo.name || 'John Doe (Demo)',
        customerEmail: customerInfo.email || 'john.doe@example.com',
        customerPhone: customerInfo.phone || '9876543210'
      });

      setCart([]);
      setView('success');
    }, 1500); // Elegant simulated loading spinner
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setView('processing');

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      // If network fails, offer Demo Simulation fallback
      setView('cart');
      const confirmDemo = window.confirm(
        'Could not connect to Razorpay services. Would you like to run in Demo Simulation Mode instead?'
      );
      if (confirmDemo) {
        simulateCheckoutSuccess();
      }
      return;
    }

    const subtotal = getSubtotal();
    const shipping = getShippingFee();
    const grandTotal = getGrandTotal();

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: grandTotal * 100, // Razorpay works in subunits (paise for INR)
      currency: 'INR',
      name: 'Leafy Lure',
      description: 'Organic Henna Purchase',
      image: '/favicon.svg',
      handler: function (response) {
        const paymentId = response.razorpay_payment_id;
        // Build receipt state
        setOrderReceipt({
          paymentId: paymentId,
          date: new Date().toLocaleString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          items: [...cart],
          subtotal: subtotal,
          shipping: shipping,
          total: grandTotal,
          deliveryAddress: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}`,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone
        });

        // Clear cart and customer info
        setCart([]);
        setView('success');
      },
      prefill: {
        name: customerInfo.name,
        email: customerInfo.email,
        contact: customerInfo.phone
      },
      notes: {
        address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}`
      },
      theme: {
        color: '#5b6e51' // Leafy Olive Green
      },
      modal: {
        ondismiss: function () {
          setView('cart');
        }
      }
    };

    try {
      const rzpInstance = new window.Razorpay(options);
      
      // Hook error callbacks for active feedback on bad Keys
      rzpInstance.on('payment.failed', function (response) {
        console.error('Razorpay Payment Failure:', response.error);
        alert(`Payment error: ${response.error.description}`);
        setView('cart');
      });

      rzpInstance.open();

      // Automatically fallback to simulation check after 4 seconds of processing
      // if the window failed to render (standard 401 Unauthorized API key error check)
      setTimeout(() => {
        // We query for the Razorpay standard iframe class or overlay
        const rzpIframe = document.querySelector('.razorpay-container');
        if (!rzpIframe && document.querySelector('.processing-container')) {
          setView('cart');
          const confirmDemo = window.confirm(
            'The Razorpay API key in your .env file appears to be invalid or unauthorized. Would you like to run in Demo Simulation Mode to preview the payment success and confirmation receipt?'
          );
          if (confirmDemo) {
            simulateCheckoutSuccess();
          }
        }
      }, 4000);

    } catch (err) {
      console.error('Razorpay Open Error:', err);
      setView('cart');
      const confirmDemo = window.confirm(
        'Razorpay could not be initialized with the active Key ID. Would you like to bypass and run in Demo Simulation Mode?'
      );
      if (confirmDemo) {
        simulateCheckoutSuccess();
      }
    }
  };

  const handleCloseModal = () => {
    setView('products');
    setCart([]);
    setOrderReceipt(null);
    onClose();
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
        >
          <motion.div
            className={`modal-content ${view === 'cart' ? 'widescreen' : ''} ${view === 'success' ? 'receipt-screen' : ''}`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={handleCloseModal}>&times;</button>

            {/* HEADER BAR FOR PRODUCT/CART VIEW */}
            {(view === 'products' || view === 'cart') && (
              <div className="modal-header">
                <h2 className="modal-title">
                  {view === 'products' ? 'Pure Leaf Henna' : 'Your Shopping Cart'}
                </h2>
                <div 
                  className={`cart-icon-wrapper ${cartItemCount > 0 ? 'pulse' : ''}`} 
                  onClick={() => setView(view === 'products' ? 'cart' : 'products')}
                >
                  <svg className="cart-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="cart-badge">{cartItemCount}</span>
                  )}
                </div>
              </div>
            )}

            {/* PRODUCT CATALOG VIEW */}
            {view === 'products' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="products-grid">
                  {PRODUCTS.map(product => (
                    <div className="product-card" key={product.id}>
                      <div className="product-image-container">
                        <img src={product.image} alt={product.name} />
                      </div>
                      <div className="product-info-panel">
                        <h3>{product.name}</h3>
                        <p className="product-desc">{product.description}</p>
                        <p className="price">₹{product.price}/-</p>
                        
                        <div className="product-actions">
                          <div className="qty-control">
                            <button 
                              type="button" 
                              onClick={() => handleQtyChange(product.id, -1)}
                              className="qty-btn"
                            >
                              -
                            </button>
                            <span className="qty-val">{quantities[product.id] || 1}</span>
                            <button 
                              type="button" 
                              onClick={() => handleQtyChange(product.id, 1)}
                              className="qty-btn"
                            >
                              +
                            </button>
                          </div>
                          
                          <button 
                            className="btn-primary add-to-cart-btn"
                            onClick={() => addToCart(product)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-info">
                  <p>Need support or custom bulk bookings?</p>
                  <a
                    href="https://www.instagram.com/leafy_lure?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glass instagram-btn"
                  >
                    Message @leafy_lure
                  </a>
                </div>
              </motion.div>
            )}

            {/* CART & CHECKOUT FORM VIEW */}
            {view === 'cart' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="checkout-container"
              >
                {cart.length === 0 ? (
                  <div className="empty-cart-state">
                    <svg className="empty-cart-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    <p>Your shopping cart is currently empty.</p>
                    <button className="btn-primary return-btn" onClick={() => setView('products')}>
                      Return to Shop
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCheckoutSubmit} className="checkout-grid">
                    
                    {/* LEFT COLUMN: ITEMS & TOTALS */}
                    <div className="cart-section">
                      <h3 className="section-title">Order Items</h3>
                      <div className="cart-items-list">
                        {cart.map(item => (
                          <div className="cart-item-row" key={item.id}>
                            <img className="cart-item-img" src={item.image} alt={item.name} />
                            <div className="cart-item-details">
                              <h4>{item.name}</h4>
                              <p className="cart-item-price">₹{item.price} each</p>
                            </div>
                            
                            <div className="cart-item-actions">
                              <div className="qty-control mini">
                                <button 
                                  type="button" 
                                  className="qty-btn"
                                  onClick={() => updateCartQty(item.id, -1)}
                                >
                                  -
                                </button>
                                <span className="qty-val">{item.quantity}</span>
                                <button 
                                  type="button" 
                                  className="qty-btn"
                                  onClick={() => updateCartQty(item.id, 1)}
                                >
                                  +
                                </button>
                              </div>
                              <button 
                                type="button" 
                                className="remove-item-btn"
                                onClick={() => removeFromCart(item.id)}
                                title="Remove item"
                              >
                                &times;
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* SUMMARY BLOCK */}
                      <div className="summary-block">
                        <div className="summary-row">
                          <span>Subtotal</span>
                          <span>₹{getSubtotal()}</span>
                        </div>
                        <div className="summary-row">
                          <span>Delivery Fee</span>
                          <span>
                            {getShippingFee() === 0 ? (
                              <span className="free-shipping-tag">FREE</span>
                            ) : (
                              `₹${getShippingFee()}`
                            )}
                          </span>
                        </div>
                        {getShippingFee() > 0 && (
                          <p className="free-ship-notice">
                            Add ₹{500 - getSubtotal()} more for <strong>FREE Delivery</strong>
                          </p>
                        )}
                        <hr className="summary-divider" />
                        <div className="summary-row total">
                          <span>Grand Total</span>
                          <span>₹{getGrandTotal()}</span>
                        </div>
                      </div>

                      <button 
                        type="button" 
                        className="btn-glass back-btn"
                        onClick={() => setView('products')}
                      >
                        &larr; Back to Shop
                      </button>
                    </div>

                    {/* RIGHT COLUMN: DELIVERY DETAILS FORM */}
                    <div className="shipping-form-section">
                      <h3 className="section-title">Delivery Details</h3>
                      
                      <div className="form-group-grid">
                        <div className="input-box full-width">
                          <input 
                            type="text" 
                            name="name" 
                            value={customerInfo.name}
                            onChange={handleInputChange}
                            required 
                          />
                          <label>Full Name</label>
                        </div>

                        <div className="input-box">
                          <input 
                            type="email" 
                            name="email" 
                            value={customerInfo.email}
                            onChange={handleInputChange}
                            required 
                          />
                          <label>Email Address</label>
                        </div>

                        <div className="input-box">
                          <input 
                            type="tel" 
                            name="phone" 
                            pattern="[6-9][0-9]{9}"
                            maxLength="10"
                            placeholder="10-digit number"
                            value={customerInfo.phone}
                            onChange={handleInputChange}
                            required 
                          />
                          <label>Mobile Number</label>
                        </div>

                        <div className="input-box full-width">
                          <input 
                            type="text" 
                            name="address" 
                            value={customerInfo.address}
                            onChange={handleInputChange}
                            required 
                          />
                          <label>Shipping Address (Flat, Street)</label>
                        </div>

                        <div className="input-box">
                          <input 
                            type="text" 
                            name="city" 
                            value={customerInfo.city}
                            onChange={handleInputChange}
                            required 
                          />
                          <label>City</label>
                        </div>

                        <div className="input-box">
                          <input 
                            type="text" 
                            name="state" 
                            value={customerInfo.state}
                            onChange={handleInputChange}
                            required 
                          />
                          <label>State</label>
                        </div>

                        <div className="input-box">
                          <input 
                            type="text" 
                            name="pincode" 
                            pattern="[0-9]{6}"
                            maxLength="6"
                            value={customerInfo.pincode}
                            onChange={handleInputChange}
                            required 
                          />
                          <label>Pincode / Zip</label>
                        </div>
                      </div>

                      <button type="submit" className="btn-primary checkout-btn">
                        Pay ₹{getGrandTotal()} with Razorpay
                      </button>

                      <div className="simulation-hint-container">
                        <span 
                          className="simulation-link" 
                          onClick={simulateCheckoutSuccess}
                          title="Simulate success bypass for key testing"
                        >
                          Or simulate checkout success (Demo Mode)
                        </span>
                      </div>
                    </div>

                  </form>
                )}
              </motion.div>
            )}

            {/* PROCESSING OVERLAY */}
            {view === 'processing' && (
              <motion.div 
                className="processing-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="leaf-loader">
                  <div className="leaf-spinner"></div>
                  <svg className="inner-leaf" viewBox="0 0 24 24" fill="var(--color-olive-green)">
                    <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.58,20.08C7.62,20.69 8.78,21 10,21C16,21 20,15 21,11C22,7 21,3 21,3C21,3 17,2.5 13,3C12,3.25 11,3.75 10,4.25C9,4.75 8,5.25 7,6C6,6.75 5.5,7.5 5,8.5C4.5,9.5 4,11 4,12.5C4,14 4.5,15.5 5.5,16.5L15,8L17,8Z" />
                  </svg>
                </div>
                <h3>Contacting Secure Payment Gateway...</h3>
                <p>Please do not refresh or close this browser window.</p>
              </motion.div>
            )}

            {/* SUCCESS & PRINTABLE RECEIPT SCREEN */}
            {view === 'success' && orderReceipt && (
              <motion.div 
                className="success-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {/* Floating animated henna leaves / confetti */}
                <div className="floating-leaves-container">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="floating-leaf-particle"
                      initial={{ 
                        opacity: 0,
                        y: -50,
                        x: Math.random() * 400 - 200, 
                        rotate: Math.random() * 360,
                        scale: Math.random() * 0.5 + 0.5
                      }}
                      animate={{ 
                        opacity: [0, 1, 1, 0],
                        y: 400,
                        x: Math.random() * 400 - 200,
                        rotate: Math.random() * 720
                      }}
                      transition={{ 
                        duration: Math.random() * 4 + 3,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </div>

                <div className="success-icon-wrapper">
                  <svg className="checkmark-svg" viewBox="0 0 52 52">
                    <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                    <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                  </svg>
                </div>

                <h3 className="success-title">Order Placed Successfully!</h3>
                <p className="success-tagline">Thank you for choosing Leafy_lure. Your natural art awaits!</p>

                {/* Printable receipt card */}
                <div className="receipt-card">
                  <div className="receipt-header">
                    <span className="brand-badge">Leafy_lure</span>
                    <span className="receipt-title">Payment Receipt</span>
                  </div>
                  
                  <div className="receipt-meta">
                    <div className="meta-col">
                      <span className="label">Order Date</span>
                      <span className="val">{orderReceipt.date}</span>
                    </div>
                    <div className="meta-col">
                      <span className="label">Transaction ID</span>
                      <span className="val rzp-id">{orderReceipt.paymentId}</span>
                    </div>
                  </div>

                  <hr className="receipt-divider" />

                  <div className="receipt-delivery">
                    <h4>Delivery Address</h4>
                    <p className="customer-name">{orderReceipt.customerName}</p>
                    <p>{orderReceipt.deliveryAddress}</p>
                    <p className="customer-contact">Contact: {orderReceipt.customerPhone} | {orderReceipt.customerEmail}</p>
                  </div>

                  <hr className="receipt-divider" />

                  <div className="receipt-items">
                    <h4>Items Purchased</h4>
                    <div className="items-table">
                      {orderReceipt.items.map(item => (
                        <div className="items-row" key={item.id}>
                          <span>{item.name} (x{item.quantity})</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr className="receipt-divider" />

                  <div className="receipt-totals">
                    <div className="totals-row">
                      <span>Subtotal</span>
                      <span>₹{orderReceipt.subtotal}</span>
                    </div>
                    <div className="totals-row">
                      <span>Delivery Fee</span>
                      <span>{orderReceipt.shipping === 0 ? 'FREE' : `₹${orderReceipt.shipping}`}</span>
                    </div>
                    <div className="totals-row grand">
                      <span>Total Paid</span>
                      <span>₹{orderReceipt.total}</span>
                    </div>
                  </div>
                </div>

                <div className="success-actions">
                  <button 
                    className="btn-glass print-btn" 
                    onClick={() => window.print()}
                  >
                    Print Receipt
                  </button>
                  <button 
                    className="btn-primary reset-btn" 
                    onClick={handleCloseModal}
                  >
                    Return to Home
                  </button>
                </div>
              </motion.div>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShopModal;
