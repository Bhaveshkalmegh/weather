

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import random
from motor.motor_asyncio import AsyncIOMotorClient
import pymongo
from bson import ObjectId



app = FastAPI()

# MongoDB connection
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["db_fast_forecase"]
collection = db["GenerateData"]


# CORS (IMPORTANT for frontend fetch)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

HISTORY_DIR = "history"

def history_path(history_id: int) -> str:
    return os.path.join(HISTORY_DIR, f"{history_id}.json")


# ✅ Clear history file
@app.post("/history/{history_id}/clear")
async def clear_history(history_id: int):
    os.makedirs(HISTORY_DIR, exist_ok=True)
    path = history_path(history_id)

    with open(path, "w") as f:
        json.dump([], f)

    return {"status": "success", "message": f"History {history_id} cleared"}


# ✅ Weather API
@app.get("/weather_random/{count}")
async def weather_random(count: int):
    if count > 50:
        raise HTTPException(status_code=400, detail="Count must be under 50")

    os.makedirs(HISTORY_DIR, exist_ok=True)
    path = history_path(1)

    # Load existing history
    if os.path.exists(path):
        with open(path, "r") as f:
            history = json.load(f)
    else:
        history = []

    cities = ["Delhi", "Mumbai", "London", "Paris", "Tokyo", "Berlin"]

    data = []
    for _ in range(count):
        item = {
            "city": random.choice(cities),
            "temperature": random.randint(10, 40),
            "humidity": random.randint(30, 90),
            "condition": random.choice(["Sunny", "Cloudy", "Rainy"]),
        }
        data.append(item)
        history.append(item)
        result = await collection.insert_one(item)
        item["_id"] = str(result.inserted_id) 


    # Save history
    with open(path, "w") as f:
        
        json.dump(history, f, indent=2)

    return data
