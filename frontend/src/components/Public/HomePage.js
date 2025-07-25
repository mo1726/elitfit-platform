import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"; // don’t import the image here

function HomePage() {
  return (
    <>
      <section className="homepage-hero">
        <div className="hero-text-container">
          <p className="hero-subtext">
            Step into a space where limits don’t exist,<br />
            where your drive, your power, and your passion<br />
            are forged into something unstoppable.<br />
            This is more than training. This is transformation.
          </p>
          <Link to="/register">
            <button className="subscribe-button">SUBSCRIBE</button>
          </Link>
        </div>
      </section>
    </>
  );
}

export default HomePage;
