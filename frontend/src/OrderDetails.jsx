import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './OrderDetails.css';

function OrderDetails() {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const statuses = ['ORDERED', 'PREPARING', 'READY FOR PICKUP', 'COMPLETED'];

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrder(data);

      } else {
        console.error("Order not found");
      }
    } catch (error) {
      console.error("Failed to fetch order", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}/status?status=${newStatus}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      if (response.ok) {
        const updatedOrder = await response.json();

        setOrder(updatedOrder);
      }
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="order-details-container"><div className="loader">Loading order details...</div></div>;
  if (!order) return <div className="order-details-container">Order not found. <button onClick={() => navigate(-1)}>Back</button></div>;

  return (
    <div className="order-details-container">
      <div className="order-details-card animate-fade">
        <header className="details-header">
          <div className="back-link" onClick={() => navigate(-1)}>
            <span>&larr;</span> Back
          </div>
          <h2>Order #{order.id}</h2>
        </header>

        <div className="order-meta">
          <div className="meta-item">
            <span className="meta-label">Customer</span>
            <span className="meta-value">{order.customer?.name || 'Guest'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Type</span>
            <span className="meta-value">{order.orderType}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Table/Room</span>
            <span className="meta-value">{order.tableNumber || 'N/A'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Date</span>
            <span className="meta-value">{new Date(order.createdAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="status-section">
          <span className="meta-label">Current Status:</span>
          <select 
            className="status-dropdown" 
            value={order.status} 
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating}
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {updating && <span className="updating-spinner">Updating...</span>}
        </div>

        <div className="items-section">
          <h3>Order Items</h3>
          <table className="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th style={{textAlign: 'right'}}>Price</th>
                <th style={{textAlign: 'right'}}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="item-name">{item.menuItem?.name || 'Deleted Item'}</td>
                  <td className="item-qty">{item.quantity}</td>
                  <td className="item-price">LKR {item.price.toFixed(2)}</td>
                  <td className="item-price">LKR {(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="order-total">
          <span className="total-label">Total Amount</span>
          <span className="total-amount">LKR {order.totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
