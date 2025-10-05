// src/pages/Dashboard.jsx
import { useState,useEffect} from "react";
import { motion } from "framer-motion";
import MapView from "../components/MapView";
import axios from "axios";
import GeminiSummary from "../components/GeminiSummary";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const threshold =60;
  // -------------------------------
  // Fetch combined data from Flask
  // -------------------------------
  const fetchCombinedData = async () => {
    setLoading(true);
    setError("");
    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      const latitude = pos.coords.latitude.toFixed(2);
      const longitude = pos.coords.longitude.toFixed(2);
      console.log(latitude,longitude);
      const res = await axios.post("https://aero-aware.onrender.com/api/combined", {
        latitude,
        longitude,
      });

      setData({ ...res.data, lat: latitude, lon: longitude });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch air quality data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
        fetchCombinedData();
      }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-sky-950 to-gray-900 text-white px-6 py-10">
      <motion.h1
        className="text-4xl sm:text-5xl font-bold text-center text-sky-400 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Air Quality Dashboard
      </motion.h1>

      {/* ---- Input Section ---- */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={fetchCombinedData}
          disabled={loading}
          className="px-6 py-2 bg-sky-500 hover:bg-sky-600 rounded-xl font-semibold text-white transition"
        >
          {loading ? "Fetching..." : "Check Air Quality"}
        </button>
      </motion.div>

      {/* ---- Error Message ---- */}
      {error && (
        <motion.p
          className="text-red-400 text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      {/* ---- MapView Section ---- */}
      {data && (
        <MapView
          lat={parseFloat(data.lat)}
          lon={parseFloat(data.lon)}
          pm25={data.ground?.pm25 || 0}
        />
      )}

      {/* ---- Data Cards ---- */}
      {data && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
          }}
        >
          {/* Ground Data */}
          <motion.div
            className="bg-gray-800/70 border border-gray-700 rounded-2xl p-6 text-center shadow hover:shadow-sky-700/30 transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-xl font-semibold text-sky-300 mb-2">
              Ground PM2.5
            </h3>
            <p className="text-4xl font-bold text-sky-400">
              {data.ground?.pm25?.toFixed(1) ?? "--"} μg/m³
            </p>
            <p className="text-gray-400 mt-2">
              Source: OpenAQ (Sensor {data.ground?.sensor_id})
            </p>
          </motion.div>

          {/* Forecast */}
          <motion.div
            className={`rounded-2xl p-6 text-center shadow border ${
              data.forecast.predicted_pm25_next_hour > threshold
                ? "bg-red-900/40 border-red-500"
                : "bg-gray-800/70 border-gray-700"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-xl font-semibold text-sky-300 mb-2">
              Predicted PM2.5 (Next Hour)
            </h3>
            <p className="text-4xl font-bold text-sky-400">
              {data.forecast?.predicted_pm25_next_hour?.toFixed(1) ?? "--"} μg/m³
            </p>
            {data.alert_triggered ? (
              <p className="text-red-400 font-semibold mt-3">
                ⚠️ Alert: Air quality may worsen!
              </p>
            ) : (
              <p className="text-green-400 font-semibold mt-3">
                ✅ Within Safe Limit
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
      {data && <GeminiSummary data={data} />}
    </div>
  );
}

