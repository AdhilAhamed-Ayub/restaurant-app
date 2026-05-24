import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './AdminMenuAdd.css';

function AdminMenuAdd() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/menu', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          available: true
        })
      });

      
      if (response.ok) {
        setFormData({ name: '', description: '', price: '', category: '' });
        alert("Dish added successfully!");
        navigate('/admin-dashboard'); // Redirect back to menu list
      }
    } catch (error) {
      console.error("Failed to add item", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="admin-content-inner animate-fade">
      <div className="content-header">
        <h2>Add New Delicacy</h2>
        <p>Expand your culinary repertoire</p>
      </div>

      <main className="admin-main">
        <section className="form-section glass-panel">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Dish Name</label>
              <input
                type="text"
                placeholder="Ex: Truffle Mushroom Pasta"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="input-group">
              <label>Description</label>
              <textarea
                placeholder="Describe the flavors and ingredients..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              
              <div className="input-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Starters">Starters</option>
                  <option value="Mains">Mains</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>
            </div>

            <button type="submit" className="primary-btn submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Publish to Menu'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default AdminMenuAdd;
