import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchService, createOrder, initiatePayment } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Popup from '../components/Popup';

export default function OrderPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    amount: 0
  });
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    fetchService(serviceId)
      .then(res => {
        setService(res.data);
        setFormData(prev => ({ ...prev, amount: res.data.price }));
      })
      .catch(err => console.error(err));
  }, [serviceId]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const orderRes = await createOrder({
        serviceId: service._id,
        ...formData
      });

      const paymentRes = await initiatePayment({
        phone: formData.customerPhone,
        amount: formData.amount,
        orderId: orderRes.data._id,
        accountReference: 'Geopram Order'
      });

      if (paymentRes.data.success) {
        setPopup({ message: 'Payment initiated! Check your phone.', type: 'success' });
        setTimeout(() => navigate('/'), 3000);
      }
    } catch (error) {
      setPopup({ message: error.response?.data?.message || 'Error processing order', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!service) return <div className="container" style={{ padding: '100px' }}>Loading...</div>;

  return (
    <>
      <Header />
      <div className="modal" style={{ background: 'rgba(0,0,0,0.9)' }}>
        <div className="modal-content">
          <span className="close-btn" onClick={() => navigate(-1)}>&times;</span>
          <h2>Order: {service.name}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="customerName"
              placeholder="Full Name"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="customerEmail"
              placeholder="Email Address"
              value={formData.customerEmail}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="customerPhone"
              placeholder="Phone Number (254...)"
              value={formData.customerPhone}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min={service.price}
              required
            />
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Processing...' : `Pay KSh ${formData.amount}`}
            </button>
          </form>
        </div>
      </div>
      {popup && <Popup message={popup.message} type={popup.type} onClose={() => setPopup(null)} />}
      <Footer />
    </>
  );
}