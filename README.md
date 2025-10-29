Access the site at: https://aero-aware.vercel.app/

# 🌍 AeroAware – Real-Time Air Quality Forecasting Platform

Welcome to **AeroAware** – a platform designed to forecast and visualize **local air quality** by integrating satellite, weather, and ground data.  
This project was developed as part of the **NASA Space Apps Challenge** to make air quality information accessible, actionable, and easy to understand.

---

## 🧩 Features

### 📡 Real-Time Weather & Air Quality Data
- Uses **OpenWeather API** for current temperature, humidity, and precipitation.
- Integrates with **NASA TEMPO mission data** for air pollution tracking.
- Automatically fetches data based on user location.

### 🧠 AI-Powered Summary
- Air quality insights are summarized in plain language using **Gemini API**.
- Provides users with easy-to-understand health implications.

### 🧭 Intuitive Forecast Dashboard
- Clean, minimal UI with **interactive graphs** and cards.
- Displays temperature, humidity, precipitation, and AQI in real-time.

### 🪄 Location Search & Detection
- Search by city or enable geolocation for instant local forecasts.

### 📜 Legal & Compliance
- Dedicated **Privacy Policy** and **Terms & Conditions** pages.
- Content structured to meet AI analysis & data handling standards.

*(⏳ Alert notification system is planned for future update.)*

---

## 🛠 Tech Stack

| Layer         | Technology                                 |
|---------------|-------------------------------------------|
| Frontend      | React + TailwindCSS + Recharts + Framer Motion |
| Backend       | Flask (Python)                |
|Data Science   | OPENAQ, NASA POWER(data collection), pandas(dataset making) , sklearn (training, hyperparameter tuning)|
| Hosting       | Vercel (Frontend) + Render (Backend)      |
| Weather Data  | OPENAQ, NASA POWER                         |
| AI Summaries  | Gemini                                |



## 🧪 Try It Out

- 🔗 [Frontend (Vercel)](https://aeroaware.vercel.app)  

---

## 🎯 NASA Space Apps Challenge Submission  
### 🌎 TEMPO Air Quality Challenge

---

## ✅ Challenge Requirement Match

| Requirement                                     | Status | Implementation                                                   |
|--------------------------------------------------|--------|------------------------------------------------------------------|
| Real-time Weather & AQ Data                      | ✅      | OpenWeather + NASA TEMPO Integration                            |
| Forecast Visualization                           | ✅      | Recharts graphs & clean UI                                      |
| AI-Powered Insights                              | ✅      | Gemini-based air quality summary                                |
| Geolocation Support                              | ✅      | Browser geolocation API                                         |
| Privacy & Terms Policy                           | ✅      | Dedicated pages with clear data handling language               |
| Health Advisory                                  | ⏳      | Planned alert feature for next phase                            |

---


## 🎥 Demo Video

> 🔗 [Watch the full demo]-> [AeroAware](https://youtu.be/bRZhZJ0AIYM)

---

## 👨‍💻 Developer

- **Shivansh** – [GitHub @ShivanshCoding36](https://github.com/ShivanshCoding36)

---

npm run build
vercel --cwd frontend
