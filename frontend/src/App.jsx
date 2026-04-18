import { useState, useEffect } from 'react';
import './App.css';
import LandingPage from './LandingPage';
import MenuPage from './MenuPage';
import AdminMenuAdd from './AdminMenuAdd';
import StaffDashboard from './StaffDashboard';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'dashboard', 'menu', 'admin-add-menu'
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all menu items from Spring Boot Backend
  const fetchMenu = async () => {
    alert("Fetching menu...");
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
      const response = await fetch('http://localhost:8080/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  useEffect(() => {
    if (currentView === 'admin-dashboard') {
      fetchMenu();
      fetchOrders();
    }
  }, [currentView]);

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalOrdersCount = orders.length;

  // Removed handleSubmit from here, moved to AdminMenuAdd component

  // Delete an item
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/menu/${id}`, { method: 'DELETE' });
      fetchMenu(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  if (currentView === 'landing') {
    return (
      <LandingPage 
        onNavigate={setCurrentView} 
        onAccessPanel={(panel) => setCurrentView(panel)} 
      />
    );
  }

  if (currentView === 'menu') {
    return <MenuPage onNavigate={setCurrentView} />;
  }

  if (currentView === 'staff-dashboard') {
    return <StaffDashboard onNavigate={setCurrentView} />;
  }
  if (currentView === 'admin-menu-add') {
    return <AdminMenuAdd onNavigate={setCurrentView} onRefresh={fetchMenu} />;
  }

  if (currentView === 'admin-dashboard') {
    return (
      <div className="app-container">
        <header className="hero-header">
          <div className="header-nav">
            <button className="back-home-btn" onClick={() => setCurrentView('landing')}>
              &larr; Exit to Home
            </button>
            <h1>A2C Admin</h1>
            <button className="add-link-btn" onClick={() => setCurrentView('admin-menu-add')}>
              + Add New Dish
            </button>
          </div>
          <p>Manage Your Culinary Portfolio</p>
        </header>

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
              <button className="primary-btn" onClick={() => setCurrentView('admin-menu-add')}>Create Your First Dish</button>
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

  return null; // Fallback
}

export default App;
