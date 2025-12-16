from fastapi import FastAPI
import requests, os, json, random
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend (React Vite) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev, allow all. Restrict in prod.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = "8e27972fbbad8c1d30d16a74ad69b309"  # replace with your OpenWeatherMap key
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

COUNTRIES = [
    "India","USA","UK","Canada","Australia","Germany","France","Italy","Spain","Brazil",
    "Mexico","Russia","China","Japan","South Korea","South Africa","Argentina","Turkey","Egypt","Saudi Arabia",
    "Indonesia","Thailand","Vietnam","Philippines","Pakistan","Bangladesh","Nigeria","Kenya","Ethiopia","Morocco",
    "Poland","Sweden","Norway","Denmark","Finland","Netherlands","Belgium","Switzerland","Austria","Portugal",
    "Chile","Colombia","Peru","Venezuela","Ukraine","Iran","Iraq","Israel","New Zealand","Singapore"
]

@app.get("/weather_random/{count}")
def get_random_weather(count: int):
    if count > 50:
        return {"error": "Count must be <= 50"}
    
    selected = random.sample(COUNTRIES, count)
    results = []

    for country in selected:
        url = f"{BASE_URL}?q={country}&appid={API_KEY}&units=metric"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            weather_info = {
                "city": data.get("name", country),
                "temperature": data.get("main", {}).get("temp"),
                "humidity": data.get("main", {}).get("humidity"),
                "condition": data.get("weather", [{}])[0].get("description")
            }
            results.append(weather_info)
        else:
            results.append({"city": country, "error": "Unable to fetch weather data"})

    # ✅ Write all results to file once
    os.makedirs("history", exist_ok=True)
    file_path = os.path.join("history", "1.json")

    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            existing = json.load(f)
    else:
        existing = []

    existing.extend(results)
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(existing, f, indent=4)

    return results