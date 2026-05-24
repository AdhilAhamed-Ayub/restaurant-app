import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './App.css';

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <header className="hero-header">
        <div className="header-nav">
          <Link to="/" className="back-home-btn">
            &larr; Home
          </Link>
          <h1>A2C Admin Panel</h1>
          <div className="admin-actions">
            <Link to="/admin/dashboard" className="nav-link-btn">Dashboard</Link>
            <Link to="/admin/menu/add" className="add-link-btn">+ Add Dish</Link>
            <button className="logout-btn" onClick={() => { logout(); navigate('/'); }}>Logout</button>
          </div>
        </div>
        <p className="welcome-msg">Logged in as {user?.name}</p>
      </header>
      
      <main className="admin-layout-content">
        {/* This is where the nested routes will render */}
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
