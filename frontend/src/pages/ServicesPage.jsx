import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchServices } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices().then(res => setServices(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <>
      <Header />
      <section className="container">
        <h1 style={{ textAlign: 'center', margin: '40px 0', color: '#00d9ff' }}>All Services</h1>
        <div className="services-grid">
          {services.map(service => (
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
      <Footer />
    </>
  );
}