import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchServices } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Popup from '../components/Popup';

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    fetchServices().then(res => setServices(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <>
      <Header />
      <section className="hero">
        <div className="container">
          <h1>Premium Services</h1>
          <p>Professional solutions for your business needs</p>
          <Link to="/services" className="btn">View Services</Link>
        </div>
      </section>

      <section className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#00d9ff' }}>Our Services</h2>
        <div className="services-grid">
          {services.slice(0, 3).map(service => (
            <div key={service._id} className="service-card">
              <div className="icon">{service.icon || '📦'}</div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="price">KSh {service.price}</div>
              <Link to={`/order/${service._id}`} className="btn">Order Now</Link>
            </div>
          ))}
        </div>
      </section>

      {popup && <Popup message={popup.message} type={popup.type} onClose={() => setPopup(null)} />}

      <Footer />
    </>
  );
}