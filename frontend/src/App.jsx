import { useState, useEffect } from 'react';
import './App.css';
import LandingPage from './LandingPage';
import MenuPage from './MenuPage';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'dashboard', 'menu'
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '' });

  // Fetch all menu items from Spring Boot Backend
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

  useEffect(() => {
    if (currentView === 'dashboard') {
      fetchMenu();
    }
  }, [currentView]);

  // Add a new menu item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    try {
      await fetch('http://localhost:8080/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          available: true
        })
      });
      setFormData({ name: '', description: '', price: '', category: '' });
      fetchMenu(); // Refresh the list
    } catch (error) {
      console.error("Failed to add item", error);
    }
  };

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
    return <LandingPage onNavigate={setCurrentView} />;
  }
  
  if (currentView === 'menu') {
    return <MenuPage onNavigate={setCurrentView} />;
  }

  return (
    <div className="app-container">
      <header className="hero-header">
        <button className="back-btn" onClick={() => setCurrentView('landing')}>
          &larr; Back to Home
        </button>
        <h1>A&D</h1>
        <p>Premium Dashboard</p>
      </header>

      <main className="dashboard">
        <section className="form-section glass-panel">
          <h2>Add New Dish</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Dish Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price ($)"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select Category</option>
              <option value="Starters">Starters</option>
              <option value="Mains">Mains</option>
              <option value="Desserts">Desserts</option>
              <option value="Beverages">Beverages</option>
            </select>
            <button type="submit" className="primary-btn">Add to Menu</button>
          </form>
        </section>

        <section className="menu-list glass-panel">
          <h2>Current Menu</h2>
          {loading ? (
            <div className="loader">Loading delicacies...</div>
          ) : menuItems.length === 0 ? (
            <p className="empty-state">No items yet. Start adding some!</p>
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

export default App;
