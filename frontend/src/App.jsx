import { useState, useEffect } from "react";
import "./App.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function App() {
  const [count, setCount] = useState(0);
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    document.title = "Fast Forecast";
  }, []);

  const fetchWeather = async () => {
    try {
      setWeatherData([]);

      // ✅ clear history first
      const clearRes = await fetch("http://127.0.0.1:8000/history/1/clear", {
        method: "POST",
      });

      if (!clearRes.ok) {
        throw new Error("Failed to clear history");
      }

      console.log("History cleared");

      // ✅ fetch weather
      const response = await fetch(
        `http://127.0.0.1:8000/weather_random/${count}`
      );

      const data = await response.json();
      setWeatherData(data);

    } catch (err) {
      console.error(err);
      alert("Error occurred. Check backend.");
    }
  };

  const chartData = {
    labels: weatherData.map((w) => w.city),
    datasets: [
      {
        label: "Temperature (°C)",

        data: weatherData.map((w) => w.temperature),
        borderColor: "green",      // 👈 line color
        backgroundColor: "rgba(0, 128, 0, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h1>🌌 Fast Forecast</h1>
      </nav>

      <div className="input-section">
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          placeholder="Enter a number under 50"
        />
        <button onClick={fetchWeather}>Get Weather</button>
      </div>

      <div className="cards">
        {weatherData.map((w, i) => (
          <div key={i} className="card">
            <h3>{w.city}</h3>
            <p>🌡 {w.temperature}°C</p>
            <p>💧 {w.humidity}%</p>
            <p>☁ {w.condition}</p>
          </div>
        ))}
      </div>

      {weatherData.length > 0 && (
        <div className="chart-container">
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
}

export default App;
