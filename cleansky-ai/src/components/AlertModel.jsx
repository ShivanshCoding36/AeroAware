import { motion } from "framer-motion";
import axios from "axios";
import { useState } from "react";

export default function AlertModal({ close, data }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function saveAlert() {
    const res = await axios.post("http://127.0.0.1:5000/api/alerts", {
      email,
      pollutant: "pm25",
      value: data.forecast.predicted_pm25_next_hour,
      lat: data.lat,
      lon: data.lon,
    });
    setMsg("✅ Alert saved! You'll be notified via email.");
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 flex justify-center items-center"
    >
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 w-96 text-center">
        <h2 className="text-xl font-semibold text-sky-400 mb-4">Setup Air Quality Alert</h2>
        <input
          className="w-full px-3 py-2 mb-4 rounded-md text-black"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex gap-3 justify-center">
          <button onClick={saveAlert} className="bg-sky-600 px-4 py-2 rounded-md font-semibold">
            Save
          </button>
          <button onClick={close} className="bg-gray-600 px-4 py-2 rounded-md font-semibold">
            Cancel
          </button>
        </div>
        {msg && <p className="mt-4 text-gray-300">{msg}</p>}
      </div>
    </motion.div>
  );
}
