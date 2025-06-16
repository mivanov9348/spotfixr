// components/Navbar.js

import React from "react";
import { Link } from "react-router-dom";


const Navbar = ({ username, user, onLogout }) => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/submit">Report Issue</Link></li>
        <li><Link to="/my-reports">Reports</Link></li>
      </ul>
      <div className="user-section">
        <span className="user-email">{username || user.email}</span>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
