import React from 'react';
import './LandingPage.css';

function LandingPage({ onNavigate }) {
  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          🍔 <span>A&D</span>
        </div>
        <div className="nav-links">
          <button className="nav-item">Home</button>
          <button className="nav-item" onClick={() => onNavigate('menu')}>Menu</button>
          <button className="nav-item">About</button>
          <button className="nav-btn admin-btn" onClick={() => onNavigate('dashboard')}>Admin Dashboard</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content glass-hero">
          <h1 className="hero-title">
             Exceptional Food, <br />
            <span className="gradient-text">Unforgettable Experience</span>
          </h1>
          <p className="hero-subtitle">
            Where Every Seat is Already Yours
          </p>
          <div className="hero-actions">
            <button className="cta-btn primary-cta" onClick={() => onNavigate('menu')}>
              Order Now 🍽️
            </button>
            <button className="cta-btn secondary-cta" onClick={() => alert('Booking coming soon!')}>
              Book a Table 🍷
            </button>
          </div>
        </div>
      </main>

      {/* Quality Highlights */}
      <section className="features-section">
        <div className="feature-card">
           <div className="feature-icon">🚀</div>
           <h3>Lightning Fast</h3>
           <p>Hot, delicious food delivered to your table or door in record time.</p>
        </div>
        <div className="feature-card">
           <div className="feature-icon">🌿</div>
           <h3>Fresh Ingredients</h3>
           <p>Locally sourced, organic produce for a vibrant and healthy taste.</p>
        </div>
        <div className="feature-card">
           <div className="feature-icon">🧑‍🍳</div>
           <h3>Master Chefs</h3>
           <p>Decades of experience woven into every single spectacular dish.</p>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
