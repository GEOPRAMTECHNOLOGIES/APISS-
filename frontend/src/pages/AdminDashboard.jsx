import React, { useState, useEffect } from 'react';
import { fetchOrders, fetchServices, updateOrderStatus, deleteService, createService } from '../utils/api';
import Popup from '../components/Popup';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: '', description: '', price: 0, icon: '📦' });
  const [activeTab, setActiveTab] = useState('orders');
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordersRes, servicesRes] = await Promise.all([
        fetchOrders(),
        fetchServices()
      ]);
      setOrders(ordersRes.data);
      setServices(servicesRes.data);
    } catch (error) {
      setPopup({ message: 'Error loading data', type: 'error' });
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      setPopup({ message: 'Order updated', type: 'success' });
    } catch (error) {
      setPopup({ message: 'Update failed', type: 'error' });
    }
  };

  const handleAddService = async e => {
    e.preventDefault();
    try {
      const res = await createService(newService);
      setServices([...services, res.data]);
      setPopup({ message: 'Service added', type: 'success' });
      setNewService({ name: '', description: '', price: 0, icon: '📦' });
    } catch (error) {
      setPopup({ message: 'Failed to add service', type: 'error' });
    }
  };

  return (
    <div className="admin-dashboard container">
      <h1>Admin Dashboard</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button className={`btn ${activeTab === 'orders' ? '' : ''}`} onClick={() => setActiveTab('orders')}>
          Orders
        </button>
        <button className="btn" onClick={() => setActiveTab('services')} style={{ marginLeft: '10px' }}>
          Services
        </button>
      </div>

      {activeTab === 'orders' && (
        <div>
          <h2 style={{ color: '#00d9ff', marginBottom: '20px' }}>Recent Orders</h2>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order.customerName}<br/><small>{order.customerEmail}</small><br/><small>{order.customerPhone}</small></td>
                  <td>{order.serviceId}</td>
                  <td>{order.amount}</td>
                  <td><span className={`status-badge status-${order.status}`}>{order.status}</span></td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select 
                      value={order.status} 
                      onChange={e => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'services' && (
        <div>
          <h2 style={{ color: '#00d9ff', marginBottom: '20px' }}>Manage Services</h2>
          <form onSubmit={handleAddService} style={{ marginBottom: '30px' }}>
            <input
              type="text"
              placeholder="Service Name"
              value={newService.name}
              onChange={e => setNewService({...newService, name: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newService.description}
              onChange={e => setNewService({...newService, description: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={newService.price}
              onChange={e => setNewService({...newService, price: e.target.value})}
              required
            />
            <button type="submit" className="btn">Add Service</button>
          </form>

          <div className="services-grid">
            {services.map(service => (
              <div key={service._id} className="service-card">
                <div className="icon">{service.icon}</div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="price">KSh {service.price}</div>
                <button 
                  className="btn" 
                  onClick={() => deleteService(service._id).then(() => {
                    setServices(services.filter(s => s._id !== service._id));
                    setPopup({ message: 'Service deleted', type: 'success' });
                  }).catch(() => setPopup({ message: 'Delete failed', type: 'error' }))}
                  style={{ background: '#ff4444' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {popup && <Popup message={popup.message} type={popup.type} onClose={() => setPopup(null)} />}
    </div>
  );
}