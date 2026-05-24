import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './App.css';

function AdminDashboard() {
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchMenu = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/menu');
      const data = await response.json();
      setMenuItems(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch menu", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ROLE_ADMIN') {
      navigate('/login');
      return;
    }
    fetchMenu();
    fetchOrders();
  }, [isAuthenticated, user, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try {
      await fetch(`http://localhost:8080/api/menu/${id}`, { method: 'DELETE' });
      fetchMenu();
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalOrdersCount = orders.length;

  return (
    <div className="admin-content-inner">
      <section className="stats-grid">
        <div className="stat-card glass-panel">
          <span className="stat-icon">💰</span>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p className="stat-value">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-icon">🧾</span>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p className="stat-value">{totalOrdersCount}</p>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-icon">🍴</span>
          <div className="stat-info">
            <h3>Menu Items</h3>
            <p className="stat-value">{menuItems.length}</p>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-icon">📊</span>
          <div className="stat-info">
            <h3>Avg Order</h3>
            <p className="stat-value">${totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount).toFixed(2) : '0.00'}</p>
          </div>
        </div>
      </section>

      <main className="dashboard-content">
        <section className="orders-summary-section glass-panel">
          <div className="list-header">
            <h2>Recent Orders</h2>
            <button className="view-all-btn" onClick={() => navigate('/staff-dashboard')}>Manage All</button>
          </div>
          <div className="orders-mini-list">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="order-mini-card clickable" onClick={() => navigate(`/order-details/${order.id}`)}>
                <div className="mini-meta">
                  <span className="mini-id">#{order.id}</span>
                  <span className="mini-status" style={{color: order.status === 'ORDERED' ? '#3b82f6' : '#FFB800'}}>{order.status}</span>
                </div>
                <div className="mini-details">
                  <span>{order.items.length} items</span>
                  <span className="mini-total">LKR {order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="menu-list-full glass-panel">
          <div className="list-header">
            <h2>Current Menu Items</h2>
            <span className="count-badge">{menuItems.length} Items</span>
          </div>
          {loading ? (
            <div className="loader">Synchronizing with kitchen...</div>
          ) : menuItems.length === 0 ? (
            <div className="empty-state">
              <p>Your menu is currently empty.</p>
              <button className="primary-btn" onClick={() => navigate('/admin-menu-add')}>Create Your First Dish</button>
            </div>
          ) : (
            <div className="grid">
              {menuItems.map((item) => (
                <div key={item.id} className="menu-card">
                  <div className="card-header">
                    <h3>{item.name}</h3>
                    <span className="price">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="description">{item.description}</p>
                  <div className="card-footer">
                    <span className="category-badge">{item.category || 'General'}</span>
                    <button onClick={() => handleDelete(item.id)} className="delete-btn">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
