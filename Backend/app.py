from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv
import requests
import pandas as pd
import joblib
import os
from datetime import datetime, timedelta,timezone

# -----------------------------
# ENV + Supabase Setup
# -----------------------------
load_dotenv()

OPENAQ_API_KEY=os.getenv("OPENAQ_API_KEY")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
# -----------------------------
# Flask Setup
# -----------------------------
app = Flask(__name__)
CORS(app)

MODEL_PATH = "Model.pkl"
model = joblib.load(MODEL_PATH) if os.path.exists(MODEL_PATH) else None


# -----------------------------
# 1. Health Check
# -----------------------------
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Backend active"})


# -----------------------------
# 2. Ground PM2.5 (OpenAQ)
# -----------------------------
# @app.route("/api/ground", methods=["GET"])
# def get_ground():
#     city = request.args.get("city", "Delhi")
#     url = "https://api.openaq.org/v2/measurements"
#     params = {
#         "city": city,
#         "parameter": "pm25",
#         "date_from": (datetime.now(datetime.timezone.utc) - timedelta(days=1)).isoformat() + "Z",
#         "limit": 100
#     }
#     r = requests.get(url, params=params).json()
#     df = pd.json_normalize(r.get("results", []))
#     return jsonify(df.to_dict(orient="records"))

HEADERS = {
    "X-API-Key": OPENAQ_API_KEY
}
PARAMETER = "pm25" 
V3_BASE_URL = "https://api.openaq.org/v3"
@app.route("/api/ground", methods=["GET"])
def get_ground():
    """
    Fetches the single latest PM2.5 measurement for a given latitude and longitude 
    using the OpenAQ V3 two-step method (Find Sensor ID, then Fetch Measurement).
    
    Expected URL Query: /api/ground?latitude=X.XXX&longitude=Y.YYY[&radius=Z]
    """
    
    # 1. Get latitude, longitude, and radius from query parameters
    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")
    radius_meters = request.args.get("radius", "10000") # Default 10km radius

    # Validation checks
    if not latitude or not longitude:
        return jsonify({"error": "Missing required parameters: latitude and longitude."}), 400
    if not OPENAQ_API_KEY:
        return jsonify({"error": "API Key not found. Please set OPENAQ_API_KEY."}), 500

    sensor_id = None
    
    # -------------------------------
    # STEP 1: FIND SENSOR ID (V3 Locations endpoint)
    # -------------------------------
    LOCATIONS_URL = f"{V3_BASE_URL}/locations"
    location_params = {
        "coordinates": f"{latitude},{longitude}",
        "radius": radius_meters,
        "parameter": PARAMETER,
        "limit": 1 # Only need the nearest location
    }

    try:
        response = requests.get(LOCATIONS_URL, headers=HEADERS, params=location_params, timeout=10)
        response.raise_for_status()
        location_data = response.json()
        
        results_list = location_data.get("results", [])

        if not results_list:
            return jsonify({
                "message": f"No air quality station found within {radius_meters}m of ({latitude}, {longitude})."
            }), 404
            
        # Access the first (nearest) location and its 'sensors' list.
        sensors = results_list[0].get("sensors", []) 
        
        if sensors:
            # CORRECT LOGIC: Check the nested 'parameter.name' field for "pm25".
            pm25_sensor = next((s for s in sensors if s.get("parameter", {}).get("name") == PARAMETER), None)
            
            if pm25_sensor:
                sensor_id = pm25_sensor.get("id")
            
        if not sensor_id:
            return jsonify({
                "message": f"Nearest station ({results_list[0].get('name')}) does not report {PARAMETER.upper()}."
            }), 404

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error finding sensor ID: {e}"}), 500

    # -------------------------------
    # STEP 2: FETCH LATEST MEASUREMENT (V3 Sensors endpoint)
    # -------------------------------
    SENSOR_MEASUREMENTS_BASE_URL = f"{V3_BASE_URL}/sensors/{sensor_id}/measurements"

    # Request the single latest reading 
    measurement_params = {
        "limit": 1,
        "sort": "desc"
    }

    try:
        response = requests.get(SENSOR_MEASUREMENTS_BASE_URL, headers=HEADERS, params=measurement_params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        results = data.get("results", [])
        
        if not results:
            return jsonify({"message": f"No recent {PARAMETER.upper()} measurements found for sensor {sensor_id}."}), 404
        
        # Process the single latest measurement
        latest_reading = results[0]
        
        # Use pandas to flatten and format the result for a cleaner output
        df = pd.json_normalize([latest_reading])
        
        response_data = {
            "value": df['value'].iloc[0],
            "unit": df['unit'].iloc[0],
            "datetime_utc": df['period.datetimeFrom.utc'].iloc[0],
            "location_name": results_list[0].get("name"),
            "latitude": results_list[0].get("coordinates", {}).get("latitude"),
            "longitude": results_list[0].get("coordinates", {}).get("longitude"),
            "sensor_id": sensor_id
        }

        # Return the processed data as a list of dictionaries 
        return jsonify([response_data])
    
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error fetching measurements: {e}"}), 500
# -----------------------------
# 3. Weather Data (NASA POWER API)
# -----------------------------
@app.route("/api/weather", methods=["GET"])
def get_weather():
    lat = request.args.get("lat", "28.61")
    lon = request.args.get("lon", "77.23")
    start = (datetime.now(datetime.timezone.utc) - timedelta(days=1)).strftime("%Y%m%d")
    end = datetime.now(datetime.timezone.utc).strftime("%Y%m%d")

    url = f"https://power.larc.nasa.gov/api/temporal/hourly/point"
    params = {
        "start": start,
        "end": end,
        "latitude": lat,
        "longitude": lon,
        "community": "RE",
        "parameters": "T2M,RH2M,PRECTOTCORR",
        "format": "JSON"
    }

    r = requests.get(url, params=params).json()
    return jsonify(r)


# -----------------------------
# 4. Predict PM2.5 Next Hour
# -----------------------------
@app.route("/api/forecast", methods=["POST"])
def forecast():
    if not model:
        return jsonify({"error": "No trained model found"}), 500
    
    data = request.json
    df = pd.DataFrame([{
        "pm25_current": data.get("pm25"),
        "temperature": data.get("temperature"),
        "humidity": data.get("humidity"),
        "precipitation": data.get("precipitation")
    }])

    pred = model.predict(df)[0]
    return jsonify({"prediction_pm25": float(pred)})

# -----------------------------
# 7. Combined Endpoint
# -----------------------------
@app.route("/api/combined", methods=["POST"])
def combined():
    """
    Combines:
    - OpenAQ ground PM2.5 data
    - NASA POWER weather data
    - Model-based PM2.5 forecast
    Optionally stores alert if threshold exceeded.
    """
    data = request.json or {}
    latitude = data.get("latitude", "28.61")
    longitude = data.get("longitude", "77.23")
    alert_threshold = data.get("alert_threshold")
    user_email = data.get("email")
    user_id = data.get("user_id")  # optional if available
    print('started')
    # -------------------------------
    # 1. Get Ground PM2.5 from OpenAQ
    # -------------------------------
    try:
        LOCATIONS_URL = f"{V3_BASE_URL}/locations"
        location_params = {
            "coordinates": f"{latitude},{longitude}",
            "radius": "10000",
            "parameter": PARAMETER,
            "limit": 1
        }
        resp = requests.get(LOCATIONS_URL, headers=HEADERS, params=location_params, timeout=10)
        resp.raise_for_status()
        loc_data = resp.json().get("results", [])
        if not loc_data:
            return jsonify({"error": "No nearby air quality sensors found"}), 404

        sensors = loc_data[0].get("sensors", [])
        pm25_sensor = next((s for s in sensors if s.get("parameter", {}).get("name") == PARAMETER), None)
        if not pm25_sensor:
            return jsonify({"error": "No PM2.5 sensor found near this location"}), 404

        sensor_id = pm25_sensor.get("id")
        SENSOR_MEASUREMENTS_URL = f"{V3_BASE_URL}/sensors/{sensor_id}/measurements"
        m_resp = requests.get(SENSOR_MEASUREMENTS_URL, headers=HEADERS, params={"limit": 1, "sort": "desc"}, timeout=10)
        m_resp.raise_for_status()
        meas_data = m_resp.json().get("results", [])
        if not meas_data:
            return jsonify({"error": "No recent PM2.5 data found"}), 404

        ground_value = meas_data[0].get("value")
        ground = {
            "pm25": ground_value,
            "sensor_id": sensor_id
        }
        print(ground)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error fetching ground data: {e}"}), 500

    try:
        if not OPENWEATHER_API_KEY:
            return jsonify({"error": "OpenWeatherMap API key not found"}), 500

        weather_url = "https://api.openweathermap.org/data/2.5/weather"
        params = {
            "lat": latitude,
            "lon": longitude,
            "appid": OPENWEATHER_API_KEY,
            "units": "metric"  # get temperature in Celsius
        }

        w_resp = requests.get(weather_url, params=params, timeout=10)
        w_resp.raise_for_status()
        w_json = w_resp.json()

        # Extract relevant info
        temperature = w_json.get("main", {}).get("temp")
        humidity = w_json.get("main", {}).get("humidity")
        # OpenWeatherMap provides rain in mm for last 1h in "rain" object
        precipitation = w_json.get("rain", {}).get("1h", 0.0)

        if temperature is None or humidity is None:
            return jsonify({"error": "Incomplete weather data received"}), 500

        weather = {
            "temperature": temperature,
            "humidity": humidity,
            "precipitation": precipitation
        }
        print(weather)

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error fetching weather data: {e}"}), 500

    # -------------------------------
    # 3. Predict Next Hour PM2.5
    # -------------------------------
    forecast_result = {}
    try:
        if model:
            df = pd.DataFrame([{
                "pm25_current": ground_value,
                "temperature": temperature,
                "humidity": humidity,
                "precipitation": precipitation
            }])
            pred = model.predict(df)[0]
            forecast_result = {"predicted_pm25_next_hour": float(pred)}
        else:
            forecast_result = {"error": "Model not loaded"}
    except Exception as e:
        forecast_result = {"error": f"Prediction error: {e}"}

    # -------------------------------
    # 5. Return Combined Response
    # -------------------------------
    return jsonify({
        "ground": ground,
        "weather": weather,
        "forecast": forecast_result,
    })


# -----------------------------
# Run Server
# -----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)


# MAKE VIDEO, SUBMIT

