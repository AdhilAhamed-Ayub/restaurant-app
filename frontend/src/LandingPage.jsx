import React from 'react';
import './LandingPage.css';

function LandingPage({ onNavigate }) {
  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          🍔 <span>A2C</span>
        </div>
        <div className="nav-links">
          <button className="nav-item" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
          <button className="nav-item" onClick={() => onNavigate('menu')}>Menu</button>
          <button className="nav-item" onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>About</button>
          <button className="nav-btn admin-btn" onClick={() => onNavigate('admin-dashboard')}>Admin Access</button>
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

      {/* About Section */}
      <section id="about" className="about-section glass-panel">
        <div className="about-content">
          <h2>Our Story</h2>
          <p>
            Founded with a passion for exceptional culinary experiences, A2C represents the pinnacle of modern dining. We merge locally sourced ingredients with master craftsmanship to deliver flavors that resonate. Every dish tells a story; every meal is a memory.
          </p>
          <div className="stats-container">
            <div className="stat">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Happy Guests</span>
            </div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Master Chefs</span>
            </div>
            <div className="stat">
              <span className="stat-number">15</span>
              <span className="stat-label">Awards Won</span>
            </div>
          </div>
        </div>
        <div className="about-image">
          <img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop" alt="Restaurant Interior" />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo footer-logo">🍔 <span>A2C</span></div>
            <p>Exceptional Food, Unforgettable Experience.</p>
          </div>
          <div className="footer-links">
            <div className="link-column">
              <h4>Quick Links</h4>
              <button className="link-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
              <button className="link-button" onClick={() => onNavigate('menu')}>Menu</button>
              <button className="link-button" onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>About</button>
            </div>
            <div className="link-column">
              <h4>Contact</h4>
              <p>📍 123 Culinary Drive</p>
              <p>📞 (555) 123-4567</p>
              <p>✉️ hello@adrestaurant.com</p>
            </div>
          <div className="link-column">
              <h4>Internal Panels</h4>
              <button className="link-button" onClick={() => onNavigate('menu')}>User Order</button>
              <button className="link-button" onClick={() => onNavigate('staff-dashboard')}>Staff Portal</button>
              <button className="link-button" onClick={() => onNavigate('admin-dashboard')}>Admin Panel</button>
            </div>
            <div className="link-column">
              <h4>Hours</h4>
              <p>Mon-Fri: 11am - 10pm</p>
              <p>Sat-Sun: 9am - 11pm</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 A2C Restaurant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
