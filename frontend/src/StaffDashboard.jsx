import React, { useState, useEffect } from 'react';
import './StaffDashboard.css';

function StaffDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'inventory'
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders');
      const data = await response.json();
      // Sort: Prepairing first, then Served, then Completed (or just by time)
      setOrders(data.sort((a, b) => b.id - a.id));
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/menu');
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error("Failed to fetch menu", error);
    }
  }

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'inventory') fetchMenu();
    
    const interval = setInterval(() => {
      if (activeTab === 'orders') fetchOrders();
    }, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:8080/api/orders/${id}/status?status=${newStatus}`, {
        method: 'PATCH'
      });
      fetchOrders();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PREPARING': return '#FFB800';
      case 'SERVED': return '#10b981';
      case 'COMPLETED': return '#3b82f6';
      default: return '#808191';
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      // Assuming we have a toggle endpoint or we use the POST/PUT endpoint to update
      // For now, let's use the main menu endpoint if it supports partial updates or just send full object
      const item = menuItems.find(i => i.id === id);
      await fetch(`http://localhost:8080/api/menu`, {
        method: 'POST', // The current backend uses POST for save/update if ID is present (typical JPA behavior)
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, available: !currentStatus })
      });
      fetchMenu();
    } catch (error) {
      console.error("Failed to toggle availability", error);
    }
  };

  return (
    <div className="staff-container">
      <header className="staff-header">
        <div className="staff-nav">
          <button className="back-btn" onClick={() => onNavigate('landing')}>&larr; Exit</button>
          <div className="tab-group">
            <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Orders</button>
            <button className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>Inventory</button>
          </div>
          <h1>Staff Portal</h1>
          <div className="status-legend">
            {activeTab === 'orders' && (
              <>
                <span className="dot preparing"></span> Prep
                <span className="dot served"></span> Served
              </>
            )}
          </div>
        </div>
      </header>

      <main className="staff-main">
        {loading && activeTab === 'orders' ? (
          <div className="loader">Incoming orders...</div>
        ) : activeTab === 'inventory' ? (
          <div className="inventory-section animate-fade">
             <div className="inventory-grid">
               {menuItems.map(item => (
                 <div key={item.id} className={`inventory-card glass-panel ${!item.available ? 'out-of-stock' : ''}`}>
                   <div className="item-info">
                     <h3>{item.name}</h3>
                     <span className="category">{item.category}</span>
                   </div>
                   <button 
                     className={`toggle-btn ${item.available ? 'btn-available' : 'btn-unavailable'}`}
                     onClick={() => toggleAvailability(item.id, item.available)}
                   >
                     {item.available ? 'Available' : 'Out of Stock'}
                   </button>
                 </div>
               ))}
             </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">No active orders. Kitchen is quiet.</div>
        ) : (
          <div className="orders-grid">
            {orders.map(order => (
              <div key={order.id} className="order-card glass-panel" style={{borderLeftColor: getStatusColor(order.status)}}>
                <div className="order-header">
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-time">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                
                <div className="order-info">
                  <span className="table-num">{order.tableNumber || 'Takeaway'}</span>
                  <span className="status-badge" style={{backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status)}}>
                    {order.status}
                  </span>
                </div>

                <div className="order-items-list">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <span className="qty">{item.quantity}x</span>
                      <span className="name">{item.menuItem?.name || 'Unknown Item'}</span>
                    </div>
                  ))}
                </div>

                <div className="order-actions">
                  {order.status === 'PREPARING' && (
                    <button className="action-btn served-btn" onClick={() => updateStatus(order.id, 'SERVED')}>
                      Mark as Served
                    </button>
                  )}
                  {order.status === 'SERVED' && (
                    <button className="action-btn complete-btn" onClick={() => updateStatus(order.id, 'COMPLETED')}>
                      Complete Order
                    </button>
                  )}
                  {order.status === 'COMPLETED' && (
                    <span className="done-label">Finished</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default StaffDashboard;
