// src/components/LandingPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css"; // optional separate styles

const LandingPage = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "FastForecast",
      description: "Accurate weather forecasting at your fingertips.",
      link: "/fastforecast",
    },
    {
      title: "Analytics",
      description: "Powerful insights for your business growth.",
      link: "/analytics",
    },
    {
      title: "Support",
      description: "24/7 customer support for all your needs.",
      link: "/support",
    },
  ];

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <h1>My Landing Page</h1>
        <ul>
          <li>Home</li>
          <li>Services</li>
          <li>About</li>
        </ul>
      </nav>

      {/* Slider */}
      <div className="slider">
        <img
          src="https://via.placeholder.com/800x300?text=Slider+Image"
          alt="slider"
        />
      </div>

      {/* Services Section */}
      <div className="services">
        <h2>Our Services</h2>
        <div className="grid">
          {services.map((service, i) => (
            <div
              key={i}
              className="card"
              onClick={() => navigate(service.link)}
            >
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© Bhavesh Kalmegh</p>
      </footer>
    </div>
  );
};

export default LandingPage;
