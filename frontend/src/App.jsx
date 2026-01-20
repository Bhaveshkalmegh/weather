// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage1";
import FastForecast from "./components/FastForecast";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/fastforecast" element={<FastForecast />} />
      <Route path="/analytics" element={<h2>Analytics Service Page</h2>} />
      <Route path="/support" element={<h2>Support Service Page</h2>} />
    </Routes>
  );
}

export default App;
