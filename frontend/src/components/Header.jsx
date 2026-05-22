import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header>
      <div className="container">
        <nav>
          <div className="logo">Geopram</div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/admin/login">Admin</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}