import { useState, useEffect } from "react";
import "./App.css"; // we'll add dark theme styles here
import { Line } from "react-chartjs-2"; // chart for visualization
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
    document.title = "Fast Forecast"; // ✅ set page title
  }, []);

  const fetchWeather = async () => {
    setWeatherData([]); // reset
    const response = await fetch(`http://127.0.0.1:8000/weather_random/${count}`);
    const data = await response.json();
    setWeatherData(data);
  };

  // Chart data (temperature trend)
  const chartData = {
    labels: weatherData.map((w) => w.city),
    datasets: [
      {
        label: "Temperature (°C)",
        data: weatherData.map((w) => w.temperature),
        borderColor: "#4ade80",
        backgroundColor: "#22c55e",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <h1>🌌 Fast Forecast</h1>
      </nav>

      {/* Input Section */}
      <div className="input-section">
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          placeholder="Enter a number under 50"
        />
        <button onClick={fetchWeather}>Get Weather</button>
      </div>

      {/* Weather Cards */}
      <div className="cards">
        {weatherData.map((w, i) => (
          <div key={i} className="card">
            <h3>{w.city}</h3>
            {w.error ? (
              <p>{w.error}</p>
            ) : (
              <>
                <p>🌡 {w.temperature}°C</p>
                <p>💧 {w.humidity}%</p>
                <p>☁ {w.condition}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Chart */}
      {weatherData.length > 0 && (
        <div className="chart-container">
          <Line data={chartData} />
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Fast Forecast | Powered by OpenWeatherMap</p>
      </footer>
    </div>
  );
}

export default App;