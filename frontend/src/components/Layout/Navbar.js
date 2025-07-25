import React, { useState } from "react";
import { Link } from "react-router-dom";  // Import Link
import "./Navbar.css";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <img src={logo} alt="Logo" className="navbar-logo" />

      {/* Menu links */}
      <div className={`menu-container ${open ? "open" : ""}`}>
        <a href="#home" className="menu-item" onClick={() => setOpen(false)}>HOME</a>
        <a href="#about" className="menu-item" onClick={() => setOpen(false)}>ABOUT</a>
        <a href="#activities" className="menu-item" onClick={() => setOpen(false)}>ACTIVITIES</a>
        <a href="#membership" className="menu-item" onClick={() => setOpen(false)}>MEMBERSHIP</a>

        {/* Login link inside menu (mobile only) */}
        <Link
          to="/login"
          className="login-button mobile-login"
          onClick={() => setOpen(false)}
        >
          LOGIN
        </Link>
      </div>

      {/* Login link outside menu (desktop only) */}
      <Link to="/login" className="login-button desktop-login">
        LOGIN
      </Link>

      {/* Hamburger button */}
      <button
        className={`menu-toggle ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </button>
    </nav>
  );
}
