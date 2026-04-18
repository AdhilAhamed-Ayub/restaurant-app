import React, { useState, useEffect } from 'react';
import './MenuPage.css';

function MenuPage({ onNavigate }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Cart State
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Categories for the filter
  const categories = ['All', 'Starters', 'Mains', 'Desserts', 'Beverages'];

  useEffect(() => {
    const fetchCustomerMenu = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/menu/available');
        const data = await response.json();
        setMenuItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load menu", error);
        setLoading(false);
      }
    };
    fetchCustomerMenu();
  }, []);

  // Filter items
  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  // Cart Functions
  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(cartItem => cartItem.item.id === item.id);
      if (existing) {
        return prev.map(cartItem => 
          cartItem.item.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    setIsCartOpen(true); // Auto open cart when item is added
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(cartItem => cartItem.item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(cartItem => {
      if (cartItem.item.id === id) {
        const newQty = cartItem.quantity + delta;
        return { ...cartItem, quantity: newQty > 0 ? newQty : 1 };
      }
      return cartItem;
    }));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    // Build the OrderRequest structured for Spring Boot
    const orderPayload = {
      orderType: 'DINE_IN',
      tableNumber: 'Table 1',
      items: cartItems.map(cartItem => ({
        menuItemId: cartItem.item.id,
        quantity: cartItem.quantity
      }))
    };

    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        alert("🎉 Order placed successfully! Our chefs are preparing it right away.");
        setCartItems([]); // clear the cart
        setIsCartOpen(false); // close sidebar
      } else {
        alert("Failed to place order. Something went wrong on the server.");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Network error: Could not reach the restaurant server.");
    }
  };

  const cartTotal = cartItems.reduce((sum, cartItem) => sum + (cartItem.item.price * cartItem.quantity), 0);
  const totalItemCount = cartItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);

  return (
    <div className="menu-page-container">
      <nav className="menu-navbar">
        <div className="logo" onClick={() => onNavigate('landing')} style={{cursor: 'pointer'}}>
          🍔 <span>A&D</span>
        </div>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <button className="cart-floating-btn" onClick={() => setIsCartOpen(true)}>
            🛒 Cart ({totalItemCount})
          </button>
          <button className="back-btn-menu" onClick={() => onNavigate('landing')}>
            &larr; Back
          </button>
        </div>
      </nav>

      <header className="menu-header glass-panel">
        <h1>Our Exquisite Menu</h1>
        <p>Discover a symphony of flavors crafted just for you.</p>
        
        {/* Category Filters */}
        <div className="category-filters">
          {categories.map(category => (
            <button 
              key={category}
              className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      <main className="menu-content">
        {loading ? (
          <div className="loader">Preparing the finest menu...</div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">No items found in this category.</div>
        ) : (
          <div className="customer-menu-grid">
            {filteredItems.map(item => (
              <div key={item.id} className="customer-menu-card glass-panel">
                <div className="card-top">
                  <span className="badge">{item.category}</span>
                  <span className="price">${item.price.toFixed(2)}</span>
                </div>
                <h3>{item.name}</h3>
                <p className="description">{item.description}</p>
                <button className="add-cart-btn" onClick={() => addToCart(item)}>
                  Add to Order
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo footer-logo">🍔 <span>A&D</span></div>
            <p>Exceptional Food, Unforgettable Experience.</p>
          </div>
          <div className="footer-links">
            <div className="link-column">
              <h4>Quick Links</h4>
              <button className="link-button" onClick={() => onNavigate('landing')}>Home</button>
              <button className="link-button" onClick={() => { onNavigate('landing'); setTimeout(() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' }), 100); }}>About</button>
            </div>
            <div className="link-column">
              <h4>Contact</h4>
              <p>📍 123 Culinary Drive</p>
              <p>📞 (555) 123-4567</p>
              <p>✉️ hello@adrestaurant.com</p>
            </div>
            <div className="link-column">
              <h4>Hours</h4>
              <p>Mon-Fri: 11am - 10pm</p>
              <p>Sat-Sun: 9am - 11pm</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 A&D Restaurant. All rights reserved.</p>
        </div>
      </footer>

      {/* Cart Drawer */}
      <div className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      <aside className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Order</h2>
          <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>&times;</button>
        </div>
        
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">Your cart is empty. Add some delicious food!</div>
          ) : (
            cartItems.map((cartItem) => (
              <div key={cartItem.item.id} className="cart-item">
                <div className="cart-item-details">
                  <h4>{cartItem.item.name}</h4>
                  <p className="cart-item-price">${(cartItem.item.price * cartItem.quantity).toFixed(2)}</p>
                </div>
                <div className="cart-item-actions">
                  <button onClick={() => updateQuantity(cartItem.item.id, -1)}>-</button>
                  <span>{cartItem.quantity}</span>
                  <button onClick={() => updateQuantity(cartItem.item.id, 1)}>+</button>
                  <button className="trash-btn" onClick={() => removeFromCart(cartItem.item.id)}>🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

export default MenuPage;
